import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, FlatList, Dimensions, RefreshControl } from 'react-native';
import Task from '../components/Task';
import uuid from 'react-native-uuid';
import axios from 'axios';

import ModalView from '../components/ModalView';
import { TaskItemsContext } from '../contexts/TaskItemsContext';
import EmptyTasks from '../components/EmptyTasks';
const config = require('../package.json')
import { constants } from '../constants/Constansts';


import * as Notifications from 'expo-notifications';

import Header from '../components/Header';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { UserContext } from '../contexts/UserContext';

const { height } = Dimensions.get('window');



function Home() {
    const [task, setTask] = useState()
    const { taskItems, setTaskItems } = useContext(TaskItemsContext)
    const scrollRef = useRef();
    const [modalVisible, setModalVisible] = useState(false)
    const [priority, setPriority] = useState('Normal')
    const [date, setDate] = useState('')
    const [idEdit, setIdEdit] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useContext(UserContext)



    const [notification, setNotification] = useState(null);

    const array = ['Összes', 'Teljesült'];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [value, setValue] = useState(array[0]);


    function transform(item) {

        return new Date(((new Date(item).toString()).split('GMT+0200')).join('GMT+0000'))

    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getTasks().then(() => setRefreshing(false));

    }, []);


    const MAX_RETRIES = 5;
    async function getTasks(numRetries = 0) {
        try {
            await axios
                .get(`${constants.BACKEND_URL}/tasks/${user.id}`)
                .then((result) => {
                    const response = result.data.data
                    if (response !== undefined && JSON.stringify(response) !== JSON.stringify(taskItems)) {
                        setTaskItems(response.sort((a, b) => a.priority.localeCompare(b.priority)));
                    }

                });
        } catch (error) {
            if (numRetries < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                await getTasks(numRetries + 1);
            } else {
                Alert.alert('Warning!', 'Hálózati hiba!');
            }
        }
    }

    useEffect(() => {
        getTasks()

    }, [])




    useEffect(() => {

        const requestNotificationPermissions = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permissions not granted');
            }
        };

        requestNotificationPermissions();


        const notificationHandler = async (notification) => {

            setNotification(notification)


            return {
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            };



        }

        Notifications.setNotificationHandler({
            handleNotification: notificationHandler,
        });


        const interval = setInterval(() => {
            const now = new Date()


            taskItems.filter(element => new Date(transform(element.date)) <= new Date(transform(now)) && element.completed == false && element.notificationId == null)
                .map(task => {

                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: `${config.title}`,
                            body: `${task.text} feladata lejárt!`,
                            sound: 'default'
                        },

                        trigger: {
                            seconds: 1,
                        },
                    })
                        .then(async (id) => {

                            try {
                                await axios.post(`${constants.BACKEND_URL}/setNotificationsId/user/${user.id}/task/${task.id}`, { notificationsId: id })
                                    .then(result => {

                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })

                                await getTasks()
                            }
                            catch (error) {
                                console.log(error)
                            }




                        }).catch(error => {
                            console.log(error)
                        })

                })


        }, 5000)


        return () => {
            clearInterval(interval)
            Notifications.setNotificationHandler({
                handleNotification: null,
            })
        }
    }, [taskItems]);



    async function handleTask() {
        Keyboard.dismiss();

        if (task == null || task == '') {
            Alert.alert('Warning!', "Kérem írjon be egy feladatot!")
            return
        }
        const newTask = {
            id: uuid.v4(),
            text: task,
            priority,
            date,
            notificationId: '',
            completed: false
        }

        await axios.post(`${constants.BACKEND_URL}/addTask/${user.id}`, newTask)
            .then(result => {

            })
            .catch(error => {
                Alert.alert('Warning!', error)
            })

        getTasks()
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
        setTask(null);
        setModalVisible(false)
        setPriority('Normal')
        setSelectedIndex(0)
        setValue(array[0])
    }


    function showModal() {
        setModalVisible(true)
        setDate('')
    }



    function _onChange(e) {
        setSelectedIndex(e.nativeEvent.selectedSegmentIndex);
    }



    function _onValueChange(val) {
        setValue(val);

    }


    return (
        <View style={styles.container}>

            <Header color={["#7FDBFF", "#32cd9a"]} />

            <View style={styles.tasksContainer}>

                <SegmentedControl
                    values={array}
                    style={styles.segmentedControl}
                    selectedIndex={selectedIndex}
                    onChange={_onChange}
                    onValueChange={_onValueChange}
                />

                <View style={{ flex: 1 }}>

                    {taskItems.length === 0 ? (
                        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                            <EmptyTasks />
                        </ScrollView>
                    ) : (
                        <>
                            {value === 'Összes' && (
                                <FlatList
                                    data={taskItems}
                                    keyExtractor={item => item.id}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}

                                    renderItem={({ item, index }) => (
                                        <View key={item.id}>
                                            <Task
                                                text={item.text}
                                                id={item.id}
                                                item={item}
                                                idEdit={idEdit}
                                                setIdEdit={setIdEdit}
                                                getTasks={() => getTasks()}
                                            />
                                        </View>
                                    )}
                                />
                            )}

                            {value === 'Teljesült' && (
                                <FlatList
                                    data={taskItems.filter(item => item.completed === true)}
                                    keyExtractor={item => item.id}
                                    showsVerticalScrollIndicator={false}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    renderItem={({ item, index }) => (
                                        <View key={item.id}>
                                            <Task
                                                text={item.text}
                                                id={item.id}
                                                item={item}
                                                idEdit={idEdit}
                                                setIdEdit={setIdEdit}
                                                getTasks={() => getTasks()}
                                            />
                                        </View>
                                    )}
                                />
                            )}
                        </>
                    )
                    }
                </View>

            </View>

            <ModalView
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                priority={priority}
                setPriority={setPriority}
                handleTask={handleTask}
                task={task}
                setTask={setTask}
                date={date}
                setDate={setDate}
            />

            <View style={styles.tagBar}>

                <TouchableOpacity onPress={showModal} >
                    <View style={styles.addContainer}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>

        </View >
    )




}

export default memo(Home)

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#faebd7',

    },

    tasksContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
        width: '100%',
        height: height * 0.71,

    },

    segmentedControl: {
        marginBottom: 20,
        width: '70%',
        alignSelf: "center",
    },

    activityContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },

    tagBar: {
        position: 'absolute',
        bottom: 20,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 11,
        height: constants.TAGBAR_HEIGHT,
        backgroundColor: 'rgba(220,220,220,0.5)',
        borderRadius: 15,

    },

    addContainer: {
        height: 60,
        width: 60,
        backgroundColor: '#C7372F',
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,

    },

    addText: {
        fontSize: 48,
        color: '#ffffff',
    },

});
