import { View, StyleSheet, Image, Dimensions, Animated, KeyboardAvoidingView, ScrollView, Text, ActivityIndicator, Alert } from "react-native";
import TodoList from '../assets/TodoList.png'
import Input from "../components/Input";
import { useContext, useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import * as AppleAuthentication from 'expo-apple-authentication';
import { constants } from "../constants/Constansts";

const { height, width } = Dimensions.get('window');



export default function Login() {



    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user, setUser } = useContext(UserContext)

    function handleForm(data) {
        setLoading(true)
        axios.post(`${constants.BACKEND_URL}/own_email/login`, data)
            .then(res => {
                const message = res.data.Message;
                const error = res.data.Error;
                setLoading(false)
                if (message) {
                    reset();
                    setError(null);
                    setLoading(false);
                    setUser(res.data.data)
                    navigation.navigate('HomeDrawer');

                } else if (error) {
                    setError(error);
                }

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                Alert.alert('Warning', error)
            })





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


    function loginRequest(data) {
        axios.post(`${constants.BACKEND_URL}/appleAuth/login`, data)
            .then(result => {
                const message = result.data.Message
                const error = result.data.Error;
                if (message) {
                    setError(null);
                    setUser(result.data.data)
                    navigation.navigate('HomeDrawer');
                } else if (error) {
                    console.log(error);
                    setError(error);
                }
            })
            .catch(error => {
                console.log(error)

            })
    }


    async function appleAuth() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            let data = {
                email: credential.email,
                fullName: credential.fullName,

            }



            await axios.post(`${constants.BACKEND_URL}/appleAuth/registration`, data)
                .then(async (result) => {
                    const message = result.data.Message;
                    const error = result.data.Error;
                    if (message) {
                        setError(null);
                        loginRequest(data)
                    } else if (error) {
                        console.log(error);
                        setError(error);
                    }
                })
                .catch(error => {
                    Alert.alert('Warning', error)
                    console.log(error)

                })

        } catch (e) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
            } else {
                console.log(e)

            }
        }
    }





    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" >
            <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}  >

                <Animated.View style={{ ...styles.logoContainer, left: positionAnim }} >
                    <Image style={styles.logo} source={TodoList} />
                </Animated.View>

                <Animated.View style={{ top: positionAnimateForms }}  >

                    {error &&
                        <View>
                            <Text style={[styles.toast, styles.errorToast]}>{error}</Text>
                        </View>
                    }

                    <Input
                        control={control}
                        name='email'
                        placeholder="Email cím"
                        antDesign="user"
                        keyboardType="email-address"
                        rules={{
                            required: 'Az email cím kitöltése kötelező!',
                            pattern: { value: constants.EMAIL_REGEX, message: "Az email cím formátuma nem megfelelő!" }
                        }}
                    />


                    <Input
                        control={control}
                        name='password'
                        placeholder="Jelszó"
                        antDesign="lock1"
                        secureTextEntry
                        rules={{ required: 'A jelszó kitöltése kötelező!' }}

                    />




                    <CustomButton color={["#7FDBFF", "#32cd9a"]} size={17} text={loading ? <ActivityIndicator size={"small"} /> : "Bejelentkezés"} onPress={handleSubmit(handleForm)} gradient />
                    <CustomButton color="#000000" size={16} text="Bejelentkezés Apple fiókkal" onPress={appleAuth} antDesign="apple1" antColor='#fff' />


                    <Text style={styles.text}>Nincs még fiókja? <Text style={styles.link} onPress={() => navigation.navigate('Register')} >Regisztráljon!</Text></Text>
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
        height: constants.HEIGHT * constants.LOGIN_HEIGHT,
        width: constants.WIDTH * constants.LOGIN_WIDTH,
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
        textAlign: 'center',
    },

    errorToast: {
        color: '#DC4C64',
    },


})