import { StyleSheet, View, Text, Dimensions, } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { constants } from '../constants/Constansts'
import { TouchableOpacity } from "react-native-gesture-handler";




export default function Button({ color, text, gradient, antDesign, antColor, modalStyle, onPress, size }) {


    return (
        <TouchableOpacity style={[{ marginBottom: 20 }, modalStyle,]} onPress={onPress}  >

            {gradient ? <LinearGradient
                colors={color}
                end={{ x: 0.3, y: 0.7 }}
                start={{ x: 0.8, y: 0.4 }}
                style={styles.buttonContainer}
            >
                <Text style={[styles.text, { fontSize: size }]}>{text}</Text>
            </LinearGradient> :

                <View style={[styles.buttonContainer, { backgroundColor: color }]}>
                    <AntDesign name={antDesign} size={24} color={antColor} style={styles.icons} />
                    <Text style={[styles.text, { fontSize: size }]}>{text}</Text>
                </View>

            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: constants.WIDTH * constants.CUSTOM_BUTTON_WIDTH,
        height: constants.HEIGHT * constants.CUSTOM_BUTTON_HEIGHT,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderRadius: 8,
        flexDirection: 'row',
    },

    icons: {
        position: 'absolute',
        left: 5,
    },

    text: {
        fontWeight: 'bold',
        letterSpacing: 1,
        color: '#fff',
    }
})



