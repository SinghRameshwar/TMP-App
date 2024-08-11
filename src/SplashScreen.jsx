
import React, { useEffect } from "react";
import AppLogo from "./common/component/AppLogo";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
    const rootViewShow = async () => {

        const loginData = await AsyncStorage.getItem('@loginData');
        if (loginData === undefined || loginData === null) {
            const providerCode = await AsyncStorage.getItem('@AppRegistration');
            if (providerCode === undefined || providerCode === null) {
                navigation.replace("QRCodeScannerContainer");
            } else {
                navigation.replace("LoginContainer");
            }
        } else {
            navigation.replace("TabNavigation");
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            rootViewShow();
        }, 2000);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <AppLogo navigation={navigation} />
    );
};

export default SplashScreen;
