import { StyleSheet, Image, Dimensions, Animated, ScrollView, Text, KeyboardAvoidingView, View, Button, ActivityIndicator, Alert } from "react-native";
import TodoList from '../assets/TodoList.png'
import Input from "../components/Input";
import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import { constants } from "../constants/Constansts";
import { FOLDER, CLOUD_NAME, UPLOAD_PRESET, CLOUDINARY_URL } from '@env'
const { height, width } = Dimensions.get('window');



export default function Register() {

    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const navigation = useNavigation();

    async function handleForm(data) {


        setLoading(true)
        try {

            if (image !== null) {
                let newFile = { uri: image, type: `image/${image.split('.')[1]}`, name: image.split('ImagePicker/')[1] }
                const checkBefore = await axios.post(`${constants.BACKEND_URL}/imageValidation`, data)

                if (checkBefore.data.Error === undefined) {
                    let selectedUrl = await handleUpload(newFile);
                    let newData = await Object.assign({}, data, { image: selectedUrl })
                    addToMongoDb(newData)

                } else {
                    console.log(checkBefore.data.Error)
                    setError(checkBefore.data.Error)
                    setLoading(false)
                }


            }
            else {
                let newData = await Object.assign({}, data, { image: null })
                addToMongoDb(newData)
            }

        }
        catch (error) {
            console.error(error);
            Alert.alert('Warning', error)

        }


    }


    function addToMongoDb(newData) {
        setLoading(true)
        axios.post(`${constants.BACKEND_URL}/own_email/registration`, newData)
            .then(result => {
                const message = result.data.Message;
                const error = result.data.Error;

                if (message) {
                    setImage(null);
                    reset();
                    setSuccess(message);
                    setError(null);
                    setLoading(false);
                } else if (error) {
                    console.log(error);
                    setError(error);
                    setLoading(false)
                }


            })
            .catch(err => {
                console.log(err)
                Alert.alert('Warning', err)


            })

    }




    async function handleUpload(image) {
        return new Promise(async (resolve, reject) => {
            const data = new FormData()
            data.append('file', image)
            data.append('upload_preset', UPLOAD_PRESET)
            data.append('cloud_name', CLOUD_NAME)
            data.append('folder', FOLDER)

            await axios.post(`${CLOUDINARY_URL}`, data)
                .then(result => {
                    resolve(result.data.url); 

                })
                .catch(err => {
                    console.log("Image upload failed!", err)
                    reject(err);
                    Alert.alert('Warning', "Image upload failed!")


                })
        })
    }



    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 0.6,

        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }





    function resetPickImage() {
        setImage(null)
    }


    const [positionAnim] = useState(new Animated.Value(constants.WIDTH));
    const [positionAnimateForms] = useState(new Animated.Value(constants.HEIGHT));


    useEffect(() => {
        Animated.timing(
            positionAnim,
            {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }
        ).start();



        Animated.timing(
            positionAnimateForms,
            {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }
        ).start();


    });


    useEffect(() => {
        if (success) {

            const timer = setTimeout(() => {
                setSuccess(null)
            }, 7000)


            return () => {
                clearTimeout(timer);
            };
        }

    }, [success])









    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" >
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}  >




                <Animated.View style={{ ...styles.logoContainer, left: positionAnim }} >
                    <Image style={styles.logo} source={TodoList} />
                </Animated.View>


                {success &&
                    <View>
                        <Text style={[styles.toast, styles.successToast]}>{success}</Text>
                    </View>
                }

                {error &&
                    <View>
                        <Text style={[styles.toast, styles.errorToast]}>{error}</Text>
                    </View>
                }

                <Animated.View style={{ top: positionAnimateForms }}  >

                    <Input
                        control={control}
                        name="username"
                        placeholder="Felhasználónév"
                        antDesign="user"
                        rules={{
                            required: 'A felhasználónév kitöltése kötelező!',
                            maxLength: { value: 22, message: "A Maximális karakterszám 22!" }
                        }}
                    />



                    <Input
                        control={control}
                        name="email"
                        placeholder="Email cím"
                        antDesign="mail"
                        keyboardType="email-address"
                        rules={{
                            required: 'Az email cím kitöltése kötelező!',
                            pattern: { value: constants.EMAIL_REGEX, message: "Az email cím formátuma nem megfelelő!" }

                        }}

                    />


                    <Input
                        control={control}
                        name="password"
                        placeholder="Jelszó"
                        antDesign="lock1"
                        secureTextEntry
                        rules={{
                            required: 'A jelszó kitöltése kötelező!',
                            minLength: { value: 8, message: "A jelszónak minimum 8 karaktert kell tartalmaznia!" }
                        }}

                    />

                    <View style={{ alignItems: 'center', marginBottom: 10, }}>
                        {image == null ? <Button title="Válasszon ki egy profilképet!" onPress={pickImage} /> : <Button title="A kiválasztott kép törlése!" onPress={resetPickImage} />}

                        {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginBottom: 10, borderRadius: 150, }} />}

                    </View>


                    <CustomButton color={["#7FDBFF", "#32cd9a"]} size={17} text={loading ? <ActivityIndicator size={"small"} /> : "Regisztráció"} onPress={handleSubmit(handleForm)} gradient />


                    <Text style={styles.text}>Van már fiókja? <Text style={styles.link} onPress={() => navigation.navigate('Login')} >Jelentkezzen be!</Text></Text>
                </Animated.View>




            </ScrollView>


        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faebd7',
    },

    logoContainer: {
        alignItems: 'center',
        padding: 50,
    },
    logo: {
        height: constants.HEIGHT * constants.REGISTER_HEIGHT,
        width: constants.WIDTH * constants.REGISTER_WIDTH,
    },

    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
    },

    link: {
        color: '#C7372F',
        fontWeight: 'bold',
    },

    toast: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    successToast: {
        color: '#77dd77',
    },

    errorToast: {
        color: '#DC4C64',
    },


})