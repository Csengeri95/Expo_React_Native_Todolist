import React, { useState } from "react";
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Modal from "react-native-modal";
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomButton from "./CustomButton";
import { constants } from "../constants/Constansts";


const moment = require('moment-timezone');

//const { width, height } = Dimensions.get('window');


export default function ModalView({ modalVisible, setModalVisible, priority, setPriority, handleTask, task, setTask, setDate }) {

    const priorities = ["Normal", "High"]


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    function showDatePicker() {
        setDatePickerVisibility(true)
    }

    function hideDatePicker() {
        setDatePickerVisibility(false)

    }

    function handleConfirm(choosenDate) {



        const dateLocale = moment.tz(choosenDate, 'Europe/Budapest').format()

        setDate(dateLocale)
        hideDatePicker();

    }


    function closeModal() {
        setModalVisible(false)
        setPriority(priorities[0])
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Modal
                isVisible={modalVisible}
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection="left"
                backdropOpacity={0.8}
                keyboardShouldPersistTaps="handled"
            >

                <View style={[styles.modalContainer, { width: `${constants.WIDTH * constants.MODAL_WIDTH}%`, maxHeight: `${constants.HEIGHT * constants.MODAL_HEIGHT}%` }]}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeModal} >
                        <View style={styles.closeWrap} >
                            <Text style={styles.closeText}>X</Text>
                        </View>
                    </TouchableOpacity>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ textAlign: 'center' }}
                    >
                        <TextInput
                            style={styles.input}
                            fontSize={16}
                            placeholder={'Ide írjon feladatot...'}
                            returnKeyType="default"
                            value={task}
                            onChangeText={text => setTask(text)}
                        />
                    </KeyboardAvoidingView>

                    <View style={styles.dropdownContainer}>
                        <Text style={{ fontSize: 18 }}>Válasszon prioritást</Text>
                        <SelectDropdown
                            data={priorities}

                            defaultValue={priority}
                            onSelect={(selectedItem) => {
                                setPriority(selectedItem)
                            }}

                            dropdownStyle={styles.dropdown1DropdownStyle}
                            buttonStyle={styles.dropdown1BtnStyle}
                            renderDropdownIcon={isOpened => {
                                return <Entypo name={isOpened ? "chevron-thin-up" : "chevron-thin-down"} size={18} color="black" />

                            }}

                        />
                    </View>




                    <View style={{ marginTop: 15 }}>
                        <Button title='Válasszon dátumot' onPress={showDatePicker} />
                        <FontAwesome5 style={{ alignSelf: 'center' }} name="calendar-alt" size={48} color="#000000" />
                        <DateTimePickerModal
                            locale="hu"
                            isVisible={isDatePickerVisible}
                            mode="datetime"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                            display="inline"
                            confirmTextIOS="Választ"
                            cancelTextIOS="Mégse"
                            date={new Date()}


                        />
                    </View>


                    <CustomButton color={["#7FDBFF", "#32cd9a"]} size={18} text="Küldés" gradient modalStyle={styles.button} onPress={handleTask} />


                </View>


            </Modal>
        </TouchableWithoutFeedback>
    )

}



const styles = StyleSheet.create({

    modalContainer: {
        flex: 1, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 15
    },

    closeModal: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    closeWrap: {
        marginRight: 10,
        marginTop: 5,

    },

    closeText: {
        color: '#C7372F',
        fontSize: 26,
        fontWeight: 600,
    },

    dropdownContainer: {
        marginTop: 20,
        alignItems: 'center'
    },

    dropdown1BtnStyle: {
        width: 250,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        marginTop: 5,
        fontSize: 14,

    },
    dropdown1DropdownStyle: {
        backgroundColor: '#FFF',
        borderRadius: 10,
    },

    input: {
        paddingVertical: 15,
        width: 250,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        marginTop: 60,

    },

    button: {
        marginTop: 50,
        alignSelf: 'center'
    }

})