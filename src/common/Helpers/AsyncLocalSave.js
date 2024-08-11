import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

export const medManagmentListSave = async (key, data) => {
    if (data.code === 200 && !data.error && data.results.length > 0) {
        await AsyncStorage.setItem(key.date, JSON.stringify(data.results));
    }
}

// Get Med Managment List Data from AsyncStorage
export const getAsyncMedManagmentListbyKey = async (key) => {
    const savedData = await AsyncStorage.getItem(key);
    const savedDataArray = savedData ? JSON.parse(savedData) : [];
    return savedDataArray
}

export const medManagmentDetailsSave = async (key, data) => {
    if (data.code === 200 && !data.error && data.results.date !== undefined) {
        await AsyncStorage.setItem(key.key, JSON.stringify(data.results));
    }
}

// Get Med Managment Details Data from AsyncStorage
export const getMedManagmentDetailsbyKey = async (key) => {
    const savedData = await AsyncStorage.getItem(key);
    const savedDataArray = savedData ? JSON.parse(savedData) : [];
    return savedDataArray
}

// Remove list to local after save on server
export const filterListForRemoveData = async (listkey, key) => {
    try {
        let datalist = await getAsyncMedManagmentListbyKey(listkey);
        const filteredArray = await datalist.filter(item => item.key !== key);
        await AsyncStorage.setItem(listkey, JSON.stringify(filteredArray));
        await medDetailsRemovebyKey(key)
        return true
    } catch (error) {
        Alert.alert(error)
    }

}

export const medDetailsRemovebyKey = async (key) => {
    await AsyncStorage.removeItem(key);
}

export const medManagmentDetailsoffLineSave = async (json_obj) => {
    try {
        const savedData = await AsyncStorage.getItem('med_management_data');
        const savedDataArray = savedData ? JSON.parse(savedData) : [];
        savedDataArray.push(json_obj);
        await AsyncStorage.setItem('med_management_data', JSON.stringify(savedDataArray));
        return true
    } catch (error) {
        Alert.alert('Warning!', error);
        return false
    }
}