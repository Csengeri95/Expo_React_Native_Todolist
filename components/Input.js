import { View, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView, Text } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Controller } from "react-hook-form";
import { constants } from "../constants/Constansts";


export default function Input({ control, name, placeholder, secureTextEntry, antDesign, keyboardType, rules = {} }) {



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}

            style={{ textAlign: 'center' }}
        >
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <>
                        <View style={[styles.formContainer, { borderColor: error ? '#DC4C64' : '#e8e8e8' }]}>
                            <TextInput
                                value={value}
                                autoCapitalize='none'
                                onChangeText={onChange}
                                onBlur={onBlur}
                                style={styles.input}
                                secureTextEntry={secureTextEntry}
                                keyboardType={keyboardType}
                                placeholder={placeholder}
                                placeholderTextColor={'rgba(0, 0, 0, 0.2)'} />

                            <AntDesign name={antDesign} size={22} color="black" />
                        </View>
                        {error && <Text style={styles.error}>{error.message}</Text>}

                    </>
                )} />




        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        paddingVertical: 15,
        width: constants.WIDTH * constants.INPUT_WIDTH,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderColor: '#e8e8e8',
        borderWidth: 1,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-around',


    },

    input: {
        width: '100%',
        height: '100%',
    },
    error: {
        color: '#DC4C64',
        alignSelf: 'stretch',
        marginTop: -15,
        marginBottom: 15,

    },
})