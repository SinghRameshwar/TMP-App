
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';



const BackNavigationWithTitleBar = ({navigation, title, date}) => {

    const calendarOpen = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.welcomeContainer}>
                <TouchableOpacity onPress={calendarOpen}>
                    <Icon name="arrow-back-outline" size={25} color="#14669A" style={styles.navigationBarIcon} />
                </TouchableOpacity>

                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.welcomeText}>{title}</Text>
                    <View style={styles.userContainer}>
                        <Text style={styles.currentDate}>{date}</Text>
                    </View>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
    },
    headerContainer: {
        padding: 16,
    },
    welcomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
        alignItems: 'center'
    },
    welcomeText: {
        fontWeight: '500',
        fontSize: 16,
        color: "#0E1012",
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentDate: {
        fontWeight: '400',
        fontSize: 12,
        color: "#0E1012",
    },

})

export default BackNavigationWithTitleBar;