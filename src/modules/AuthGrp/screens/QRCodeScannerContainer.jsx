import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, Platform } from 'react-native';
import NavigationBar from '../component/NavigationBar';
import { qRRegistationApiCallandResponse } from '../data/apiCallandResult';
import { SafeAreaView } from 'react-native-safe-area-context';



const QRCodeScannerContainer = ({ navigation }) => {
    const [loginClick, setloginClick] = useState(false);


    const registerViewOpen = () => {
        navigation.navigate('EnterRegistredCode');
    }

    const openCameraQRReader = async () => {
            navigation.navigate('QRCodeScanCamera', { callBack: callBackMethodQRScanned })
    }

    const callBackMethodQRScanned = (data) => {
        if (!loginClick) {
            if (data.length > 5 || data.length < 5) {
                Alert.alert('Warning', 'envalid QR Code!');
                return;
            }
            setloginClick(true)
            qRRegistationApiCallandResponse({
                registerCode: data,
                setloginClick: setloginClick,
                navigation: navigation
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <NavigationBar navigation='' title="Register Device" />

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>

                <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: .8 }}>
                    <Image
                        source={require('../../../assets/images/path102.png')}
                        resizeMode="cover"
                    />
                    <Image
                        source={require('../../../assets/images/group_2676.png')}
                        resizeMode="cover"
                        style={{ position: 'absolute' }}
                    />

                    <Image
                        source={require('../../../assets/images/group_2673.png')}
                        resizeMode="center"
                        style={{ position: 'absolute' }}
                    />
                </View>
                <Text style={{ textAlign: 'center', paddingLeft: 40, paddingRight: 40, fontWeight: '400', fontSize: 12, color: '#0E1012', marginTop: 25 }}>
                    Your Device is not registered to use with TaskMaster Pro
                </Text>

            </View>



            <View style={{ backgroundColor: '#E2F6E3', borderRadius: 15, padding: 16, margin: 16 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ alignItems: 'center', paddingRight: 5, paddingLeft: 5 }}>
                        <Text style={{ fontWeight: '700', color: '#0E1012' }}>To Register </Text>
                        <Text style={{ fontWeight: '300', color: '#0E1012' }}>
                            your SDL Device, Scan QR code or enter Registration code generated on TaskMaster Pro web
                        </Text>
                    </Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#59B952', borderRadius: 20, marginTop: 10, marginBottom: 10 }} onPress={() => openCameraQRReader()}>
                    <Text style={{ color: 'white', alignSelf: 'center', padding: 10 }}>{loginClick ? 'Loading...' : 'Scan QR Code'}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <View style={{ height: 1, backgroundColor: 'grey', width: '40%' }} />
                    <View style={{ backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 10 }}>
                        <Text style={{ fontWeight: '400' }}>OR</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: 'grey', width: '40%' }} />
                </View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, borderColor: 'grey', borderWidth: 1 }} onPress={() => registerViewOpen()}>
                    <Text style={{ color: '#0E1012', alignSelf: 'center', padding: 10 }}>Registration Code</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default QRCodeScannerContainer;
