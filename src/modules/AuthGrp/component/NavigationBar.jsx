import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavigationBar = ({ navigation, title }) => {

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 71, backgroundColor: '#E2F6E3', paddingHorizontal: 16}}>
            <TouchableOpacity onPress={goBack} style = {{display: navigation === '' ? 'none' : 'flex'}}>
                <Ionicons name="arrow-back" size={28} color="grey"/>
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color:"#0E1012" }}>{title}</Text>
        </View>
    );
};

export default NavigationBar;
