import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'

const WelcomeNavigationBar = ({ setisMenuOpen, isMenuOpen }) => {
    const [userName, setuserName] = useState('')
    const [date, setdate] = useState('')

    const getdataToAsyncStorage = async () => {
        const loginData = JSON.parse(await AsyncStorage.getItem('@loginData'));
        setuserName(loginData.firstLastname);
        setdate(moment(new Date()).format('MMMM-DD-yyyy'))
    }

    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        getdataToAsyncStorage();

    }, [])

    return (
        <View style={styles.welcomeContainer}>
            <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <View style={styles.userContainer}>
                    <Text style={styles.username}>{capitalizeFirstLetter(userName)}</Text>
                    <Text style={styles.currentDate}>{date}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => setisMenuOpen(true)}>
                <Image
                    source={require("../../assets/images/app_logo.png")}
                    resizeMode="contain"
                    style={styles.userImage}
                />
            </TouchableOpacity>
        </View>
    )

}

const styles = StyleSheet.create({
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
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
    username: {
        fontWeight: '700',
        fontSize: 18,
        color: "#14669A",
    },
    currentDate: {
        fontWeight: '400',
        fontSize: 12,
        color: "#0E1012",
        alignSelf: 'flex-end',
        marginLeft: 5,
        marginBottom:2
    },
    userImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        shadowColor: 'grey',
        elevation: 10,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
})

export default WelcomeNavigationBar;