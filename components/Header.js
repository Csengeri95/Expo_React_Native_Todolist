import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';



const config = require('../package.json')

export default function Header({ color }) {

    const navigation = useNavigation();


    return (

        <LinearGradient
            colors={color}
            end={{ x: 0.3, y: 0.7 }}
            start={{ x: 0.8, y: 0.4 }}
            style={styles.header}
        >

            <View style={styles.menuContainer} >
                <MaterialCommunityIcons style={styles.menu} name="menu" size={32} color="black" onPress={() => navigation.openDrawer()} />
            </View>

            <Text style={styles.title}>{config.title}</Text>


        </LinearGradient>

    )
}


const styles = StyleSheet.create({
    header: {
        height: 100,
        paddingTop: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },

    title: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoContainer: {
        width: 40,
        height: 40,
        paddingTop: 35,
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
    },
    logo: {
        width: 50,
        height: 50,
        alignSelf: 'center',
    },

    menuContainer: {
        justifyContent: 'center',
        position: 'absolute',
        left: 20,
        top: 35,

    },

    menu: {
        marginTop: 20,
    },
})