import { DrawerItem } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';


export default function CustomDrawerItem({ label, icon, onPress, labelStyle }) {

    return (
        <DrawerItem label={label} icon={() => icon} labelStyle={[styles.drawerLabel, labelStyle]} style={styles.drawerItem} onPress={onPress} />
    )
}


const styles = StyleSheet.create({
    drawerItem: {
        width: '98%',
        backgroundColor: "#1E90FF",
        margin: 'auto',
        alignSelf: 'center',
        borderRadius: 8,
        padding: 5,
        marginBottom: 5,

    },
    drawerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
})