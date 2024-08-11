import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SessionOut } from '../../../common/Helpers/SessionOut';

const MenuListComp = ({ setisMenuOpen, isMenuOpen, dispatch }) => {

    const logOutButtonClick = () => {
        setisMenuOpen(false)
        SessionOut(dispatch);
    }

    const backgrounfClickAction = () => {
        setisMenuOpen(false)
    }

    return (
        <TouchableOpacity onPress={backgrounfClickAction} style={[styles.container, { display: isMenuOpen ? 'flex' : 'none' }]}>
            <SafeAreaView>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={logOutButtonClick}>
                        <AntDesign name="poweroff" size={20} color="red" style={styles.icon} />
                        <Text style={styles.menuText}>Log-out</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'flex-end',
    },
    menuContainer: {
        width: 150,
        backgroundColor: 'white',
        marginTop: '20%',
        padding: 24,
        borderRadius: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 16,
    },
    menuText: {
        fontWeight: '700',
    },
});

export default MenuListComp;
