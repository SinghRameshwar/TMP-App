import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableRipple } from 'react-native-paper'; // For ripple effect
import DashboardContainer from './HomeGrp/screens/DashboardContainer';
import MEDManagmentContainer from './MedManagmentGrp/screens/MEDManagmentContainer';
import SDLLogStatusContainer from './SdlGrp/screens/SDLLogStatusContainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import UnscheduledContainer from './UnscheduledSDLGrp/screens/UnscheduledContainer';

const TabNavigation = ({ navigation }) => {
    const animation = useRef(new Animated.Value(0)).current;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(1)); // Initial opacity of 1
    const [isbuttomTabDisplay, setisbuttomTabDisplay] = useState(true);

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 6,
            useNativeDriver: true,
        }).start();

        if (isOpen === true) {
            setIsOpen(false);
            if (selectedTab !== 0) {
                selectTabButton(0);
            }
        } else {
            setIsOpen(true);
        }


    };

    const selectTabButton = (tabIndex) => {
        Animated.timing(fadeAnim, {
            toValue: 0.5, // Fade out current view
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setSelectedTab(tabIndex); // Set the new tab
            Animated.timing(fadeAnim, {
                toValue: 1, // Fade in new view
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const opacity = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {selectedTab === 0 && <DashboardContainer navigation={navigation} />}
                {selectedTab === 1 && <SDLLogStatusContainer navigation={navigation} setisbuttomTabDisplay = {setisbuttomTabDisplay}/>}
                {selectedTab === 2 && <MEDManagmentContainer navigation={navigation} />}
            </Animated.View>

            {/* <View style={[StyleSheet.absoluteFill, styles.overlay]}> */}
            <View style={[styles.overlay, {display: isbuttomTabDisplay ? 'flex' : 'none'}]}>
                <Animated.View style={[styles.buttonWrapper, { opacity }]}>
                    <View style={styles.buttomcontainer}>
                        <TouchableOpacity onPress={() => selectTabButton(1)} style={{ padding: 7, marginLeft: 16, alignItems: 'center' }}>
                            <FontAwesome name="tasks" size={20} color="white" style = {styles.iconStyle}/>
                            <Text style={{ color: 'white', fontWeight: '500' }}>SDL</Text>
                        </TouchableOpacity>


                        {/* <TouchableOpacity style={{ padding: 7, alignItems: 'center' }}>
                            <Entypo name="documents" size={20} color="white" style = {styles.iconStyle}/>
                            <Text style={{ color: 'white', fontWeight: '500' }}>DOC</Text>
                        </TouchableOpacity>

                        <View style={{ width: 20 }} />

                        <TouchableOpacity onPress={() => selectTabButton(3)} style={{ padding: 7, alignItems: 'center' }}>
                            <Icon name="schedule" size={20} color="white" style = {styles.iconStyle} />
                            <Text style={{ color: 'white', fontWeight: '500' }}>SDL-UN</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => selectTabButton(2)} style={{ padding: 7, marginRight: 16, alignItems: 'center' }}>
                            <MaterialCommunityIcons name="human" size={20} color="white" style = {styles.iconStyle}/>
                            <Text style={{ color: 'white', fontWeight: '500' }}>EMAR</Text>
                        </TouchableOpacity>

                    </View>
                </Animated.View>

                <TouchableRipple
                    rippleColor="rgba(0, 0, 0, .32)"
                    style={[styles.button, styles.menu]}
                    onPress={toggleMenu}
                >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <Icon name={isOpen ? "home" : "add"} size={24} color="white" />
                    </Animated.View>
                </TouchableRipple>


            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        elevation: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        marginBottom: 30,
    },
    menu: {
        backgroundColor: '#14669A',
    },
    overlay: {
        marginTop: -80,
        alignItems: 'center',
        justifyContent: 'flex-end',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    buttonWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0, // Adjust based on your UI
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    buttomcontainer: {
        flex: 1,
        backgroundColor: '#14669A',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 50,
        marginBottom:5
    },
    iconStyle:{
        elevation: 10,
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    }
});

export default TabNavigation;
