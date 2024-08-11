import { Alert } from "react-native";
import { registerCodeToQRApiCall } from "../../../common/services/RegisterCodeToQRApiCall";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RequestTokenApi } from "../../../common/services/RequestTokenApi";
import { LoginApiWithToken } from "../../../common/services/LoginApiWithToken";

export const qRRegistationApiCallandResponse = async (payload) => {
    try {
        const response = await registerCodeToQRApiCall(payload.registerCode);
        //console.log('---------------', response)
        if (response.code === 200 && response.error === false) {
            await AsyncStorage.setItem('@AppRegistration', JSON.stringify(response.results))
            payload.navigation.replace('LoginContainer');
        } else {
            payload.setloginClick(false);
            Alert.alert('Warning', response.message);
        }
    } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
        console.error('Error in registerQRCode:', error);
    }
}



export const apiCallWithproviderCodeAndRespondeHandel = async (payload) => {

    try {
        const providerCode = JSON.parse(await AsyncStorage.getItem('@AppRegistration'));
        if (!providerCode) {
            Alert.alert('Warning', 'Provider code not found.');
            return;
        }

        const response = await RequestTokenApi({
            providerCode: providerCode.provider_code,
            username: payload.userName,
            password: payload.password
        })

        if (response.code === 200 && response.error === false) {
            payload.setloginClick(false)
            await AsyncStorage.setItem('@loginData', JSON.stringify({ token: response.results.token, user: payload.userName, firstLastname: response.results.first_name+' '+response.results.last_name }))
            payload.navigation.replace('TabNavigation')
            //     console.log('---------------',respo)
        } else {
            payload.setloginClick(false)
            Alert.alert('Warning', response.message)
        }
    } catch (error) {
        Alert.alert('Error', error);
        console.error('Error in loginWithProviderCode:', error);
    }

}



// Currently Not use this
export const apiCallwithssotoken = async (payload) => {
    const respo = await LoginApiWithToken({
        providerCode: 'test',
        username: 'alexmorrison',
        ssotoken: response.results.token
    })

}