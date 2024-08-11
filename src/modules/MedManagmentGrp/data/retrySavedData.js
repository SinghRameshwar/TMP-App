import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MEDMagSchedulesApi } from '../../../common/services/MEDMagSchedulesApi';
import { Alert } from 'react-native';

export const retrySavedData = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
        const savedData = await AsyncStorage.getItem('med_management_data');
        if (savedData) {
            const savedDataArray = JSON.parse(savedData);
            for (const item of savedDataArray) {
                try {
                    const response = await MEDMagSchedulesApi(item);
                    if (response.code === 200 && response.error === false) {
                        // Remove successfully sent item from local storage
                        const index = savedDataArray.indexOf(item);
                        if (index > -1) {
                            savedDataArray.splice(index, 1);
                        }
                    } else if (response.code === 401 && response.error === true) {
                       Alert.alert('Warning', 'Session Out Please Logout to Login Agen!')
                        return;
                    } else {
                        Alert.alert('Warning!', response.message);
                    }
                } catch (error) {
                    Alert.alert('Warning!', error.message);
                }
            }
            // Update local storage with remaining items
            await AsyncStorage.setItem('med_management_data', JSON.stringify(savedDataArray));
        }
    }
};

