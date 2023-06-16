import { Text, View, StyleSheet } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';

export default function EmptyTasks() {

    return (
        <View style={styles.container}>
            <View>
                <FontAwesome5 name="tasks" size={60} color="#303030" />
            </View>
            <Text style={styles.title}>
                Önnek jelenleg nincs feladata!
            </Text>
            <Text style={styles.text}>
                Az Ön által beírt feladatok itt jelennek meg!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    text: {
        fontSize: 14,
    },
})