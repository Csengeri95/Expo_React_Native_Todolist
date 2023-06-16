import React, { useContext, useState, useEffect } from "react";
import { Text, StyleSheet, View, Dimensions, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { PanGestureHandler, TextInput } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import { constants } from "../constants/Constansts";
import { TaskItemsContext } from "../contexts/TaskItemsContext";

const moment = require('moment-timezone');


export default function Task({ getTasks, text, id, item, idEdit, setIdEdit }) {


    const { user } = useContext(UserContext)
    const { taskItems } = useContext(TaskItemsContext)


    async function completeTask() {

        await axios.post(`${constants.BACKEND_URL}/deleteTask/user/${user.id}/task/${id}`)
            .then(result => {
                getTasks()
            })
            .catch(error => {
                Alert.alert('Warning', error)
            })


    }



    const translateX = useSharedValue(0)
    const iconContainerWidth = useSharedValue(0);
    const itemHeight = useSharedValue(constants.ITEM_HEIGHT)

    const panGesture = useAnimatedGestureHandler({

        onActive: (event) => {
            if (event.translationX < 0) {
                translateX.value = event.translationX;


                iconContainerWidth.value = Math.max(
                    0,
                    Math.min(event.translationX * -1, constants.WIDTH * 5)
                );
            }



        },


        onEnd: (event) => {
            if (event.translationX < -140) {

                translateX.value = withTiming(-constants.WIDTH, undefined, (finished) => {
                    if (finished) {
                        runOnJS(completeTask)();
                    }
                });


                iconContainerWidth.value = withTiming(0)
                itemHeight.value = withTiming(0)

            }

            else {
                translateX.value = withTiming(0);
                iconContainerWidth.value = withTiming(0);

            }
        },
    })



    const rStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: translateX.value,
        },
        ]
    }))

    const rIconContainerStyle = useAnimatedStyle(() => ({
        width: iconContainerWidth.value,
    }));

    const rContainer = useAnimatedStyle(() => {
        return {
            height: itemHeight.value,
            marginBottom: 10,

        }
    })



    function handleEdit(id) {
        if (item.completed === false) {
            setIdEdit(id)
        }
        else {
            return Alert.alert('Warning!', "A feladat már nem szerkeszthető!")
        }


    }



    async function handleUpdate(newValue) {

        await axios.post(`${constants.BACKEND_URL}/updateTask/user/${user.id}/task/${id}`, { newValue: newValue })
            .then(result => {

            })
            .catch(error => {
                console.log(error)
            })
        await getTasks()
        setIdEdit(null)



    }




    const formattedDate = item.date ? moment.tz(item.date, 'Europe/Budapest').format('YYYY-MM-DD HH:mm') : ''


    return (
        <ScrollView >
            <Animated.View style={[rContainer]}>

                <Animated.View style={[styles.iconContainer, rIconContainerStyle]} >

                    <AntDesign name="delete" size={40} color="#FFF" />
                </Animated.View>


                <PanGestureHandler onGestureEvent={panGesture} activeOffsetX={[-10, 10]}
                >

                    <Animated.View style={[styles.item, rStyle]}  >
                        <View style={styles.itemLeft}>



                            {idEdit === id ?

                                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={{ textAlign: 'center' }}>

                                    <View style={styles.input} >
                                        <TextInput
                                            scrollEnabled={true}
                                            style={{ fontSize: 16 }}
                                            defaultValue={text}
                                            autoFocus={true}
                                            returnKeyType="done"
                                            onSubmitEditing={(e) => handleUpdate(e.nativeEvent.text)}
                                        />
                                    </View>

                                </KeyboardAvoidingView>


                                :
                                <View style={styles.itemTextContainer} >
                                    <Text multiline={true} numberOfLines={5} style={styles.itemText}>{text}</Text>
                                    <Text style={!item.completed ? styles.itemDate : styles.itemDateDone}>{formattedDate || ''}</Text>
                                </View>

                            }


                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                            {idEdit === id ?
                                <MaterialIcons name="cancel" size={24} color="red" onPress={() => setIdEdit(null)} />
                                :
                                <AntDesign name="edit" size={24} color="black" onPress={() => handleEdit(id)} />
                            }



                            <View style={[styles.circular, { backgroundColor: item.priority === 'High' ? '#C7372F' : '#55BCF6' }]} >

                            </View>
                        </View>




                    </Animated.View>

                </PanGestureHandler>




            </Animated.View>
        </ScrollView>
    )


}

const styles = StyleSheet.create({

    item: {
        backgroundColor: '#FFF',
        padding: 15,
        height: constants.ITEM_HEIGHT,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowOpacity: 0.07,
        shadowOffset: {
            width: 5,
            height: 10,
        },

    },
    itemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',


    },

    itemTextContainer: {
        height: '50%',
        flexShrink: 1,
        marginTop: 15,
        marginLeft: 10,
    },

    itemText: {
        fontSize: 16,
    },

    itemDate: {
        fontSize: 13,
        color: '#cb4154',
        fontWeight: 600,
    },

    itemDateDone: {
        fontSize: 13,
        color: '#cb4154',
        fontWeight: 600,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },

    circular: {
        width: 16,
        height: 16,
        borderRadius: 50,
        borderColor: 0,
        borderWidth: 2,
        marginLeft: 30,
    },

    iconContainer: {
        height: constants.ITEM_HEIGHT,
        width: 100,
        backgroundColor: '#C7372F',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },

    input: {
        width: 110,
    }
});