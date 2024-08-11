
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const locationPermasion = async () => {
    if (Platform.OS === 'ios') {
        const permissionStatus = await Geolocation.requestAuthorization(
            'whenInUse',
        );
        if (permissionStatus === 'granted') {
            return true;
        } else {
            return false;
        }
    } else {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

export const getLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};