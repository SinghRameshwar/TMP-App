import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

const NarationViewWithbutton = ({ title, navigation, calendarOpen, date }) => {

    const backButtonPress = () => {
        navigation.goBack()
    }


    return (
        <View style={styles.headerContainer}>
            <View style={styles.welcomeContainer}>
                <TouchableOpacity
                    onPress={backButtonPress}
                    style={{ display: navigation ? 'flex' : 'none' }}>
                    <Icon name="arrow-back-outline" size={25} color="#14669A" style={styles.navigationBarIcon} />
                </TouchableOpacity>

                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.welcomeText}>{title}</Text>
                    <View style={styles.userContainer}>
                        <Text style={styles.currentDate}>{moment(date).format('MMM-DD-yyyy')}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => calendarOpen()}>
                    <View style={styles.navigationBarIcon1}>
                        <Icon name="calendar-outline" size={25} color="#14669A" style={[styles.navigationBarIcon, { marginRight: 20 }]} />
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => calendarOpen()}>
                    <View style={styles.navigationBarIcon1}>
                        <MaterialCommunityIcon name="tune" size={25} color="#14669A" style={styles.navigationBarIcon} />
                    </View>
                </TouchableOpacity> */}

            </View>
        </View>
    )

}

const styles = StyleSheet.create({

    headerContainer: {
        padding: 16,
    },
    welcomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    welcomeTextContainer: {
        flex: 1,
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
    navigationBarIcon: {
        padding: 8,
    },
    navigationBarIcon1: {
        shadowColor: 'grey',
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
    }
});

export default NarationViewWithbutton;