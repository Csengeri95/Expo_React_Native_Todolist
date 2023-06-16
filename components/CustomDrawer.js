import { View, Image, StyleSheet, Text, Alert, Pressable } from "react-native"
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Profile from '../assets/ProfilePicture.png'
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import CustomDrawerItem from "./CustomDrawerItem";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { constants } from "../constants/Constansts";
import { FOLDER, CLOUD_NAME, UPLOAD_PRESET, CLOUDINARY_URL } from '@env'
import Wave from "./Wave";

const config = require('../package.json')


export default function CustomDrawer({ ...props }) {

    const { showActionSheetWithOptions } = useActionSheet();

    const navigation = useNavigation();
    const { user, setUser } = useContext(UserContext)
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)



    function actionSheet() {
        const options = ['Profilkép megváltoztatása', 'Mégse'];
        const destructiveButtonIndex = 0;
        const cancelButtonIndex = 1;

        showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            destructiveButtonIndex,

        }, (selectedIndex) => {
            switch (selectedIndex) {

                case destructiveButtonIndex:
                    pickImage()
                    break;

                case cancelButtonIndex:
                
            }
        });
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

        } else {
            setImage(null)
        }
    }

    useEffect(() => {
        upload();
    }, [image])



    function upload() {
        if (image !== null) {
            let newFile = { uri: image, type: `image/${image.split('.')[1]}`, name: image.split('ImagePicker/')[1] }
            handleUpload(newFile)
        }

    }

    function changeImage(data) {
        axios.post(`${constants.BACKEND_URL}/imageChange/${user.id}`, { image: data })
            .then(result => {
                setImage(null)
                getUser()
            })
            .catch(error => {
                console.log(error)
                Alert.alert('Warning!', error)
            })
    }

    function handleUpload(image) {

        setLoading(true)
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', UPLOAD_PRESET)
        data.append('cloud_name', CLOUD_NAME)
        data.append('folder', FOLDER)

        axios.post(`${CLOUDINARY_URL}`, data)
            .then(result => {

                changeImage(result.data.url)

            })
            .catch(err => {
                console.log("Image upload failed!", err)
                Alert.alert('Warning', "Image upload failed!")


            })
    }

    useEffect(() => {

        getUser()

    }, [])


    function getUser() {
        try {
            axios.get(`${constants.BACKEND_URL}/getProfile/${user.id}`)
                .then(result => {
                    const message = result.data.Message;
                    const error = result.data.Error;
                    if (message) {
                        setUser(result.data.data)
                        setLoading(false)
                    }
                    if (error) {
                        console.log(result.data.Error)
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        } catch (error) {
            console.log(error)
        }
    }


    return (

        <>

            <DrawerContentScrollView {...props}>


                <Pressable style={styles.profileContainer} onPress={actionSheet} >
                    <View style={styles.profileContainer}>

                        <Image source={user && user.image ? { uri: user.image } : Profile} style={styles.profileIcon} />
                        {loading && (
                            <View style={styles.waveContainer}>
                                <Wave loading={loading} />
                            </View>
                        )}
                    </View>
                </Pressable>


                <Text style={styles.username}>
                    {user != null && user.username
                        ? user.username
                        : (user && user.familyName && user.givenName)
                            ? `${user.familyName} ${user.givenName}`
                            : 'Unknown User'}
                </Text>


                <View >

                    <CustomDrawerItem
                        icon={<AntDesign name="profile" size={constants.DRAWER_ICON} color={constants.DRAWER_ICON_COLOR} />}
                        label='Profil'
                        onPress={() => navigation.navigate('Home')}
                    />
                    <CustomDrawerItem
                        icon={<Feather name="settings" size={constants.DRAWER_ICON} color={constants.DRAWER_ICON_COLOR} />}
                        label='Beállítások'
                        onPress={() => navigation.navigate('Home')}
                    />

                    <CustomDrawerItem
                        icon={<MaterialIcons name="help-outline" size={constants.DRAWER_ICON} color={constants.DRAWER_ICON_COLOR} />}
                        label='Súgóközpont'
                        onPress={() => navigation.navigate('Home')}
                    />

                    <CustomDrawerItem
                        icon={<SimpleLineIcons name="info" size={constants.DRAWER_ICON} color={constants.DRAWER_ICON_COLOR} />}
                        label='Névjegy'
                        onPress={() => navigation.navigate('Home')}
                    />

                   

                </View>

                <Image source={require("../assets/TodoList.png")} style={styles.brandIcon} />
                <View style={styles.footer}>
                    <Text style={styles.footerCreator}>{config.creator}</Text>
                    <Text style={styles.footerText}>{config.year}</Text>
                    <Text style={styles.footerText}>{config.version}</Text>
                </View>


                <Wave />



            </DrawerContentScrollView>

        </>
    )
}

const styles = StyleSheet.create({
    profileContainer: {
        alignItems: 'center',
        marginBottom: 10,
        position: "relative",
    },
    waveContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        borderRadius: 150,
        height: 120,
        width: 120,
        borderColor: '#FFF',
        borderWidth: 3,

    },

    username: {
        color: "#333333",
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 25,
        alignSelf: 'center',
    },
    brandIcon: {
        height: 180,
        width: 180,
        alignSelf: 'center',
        marginVertical: 30,
    },
    footer: {
        alignSelf: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
    },
    footerCreator: {
        fontSize: 14,
        color: '#c00000',
    },


})