import AsyncStorage from "@react-native-async-storage/async-storage";
import ApiConfig from "../../api/ApiConfig";

/**
 * Makes an API call to authenticate the user.
 * 
 * @param {Object} payload - The user credentials.
 * @param {string} payload.providerCode - The provider code.
 * @param {string} payload.username - The username.
 * @param {string} payload.password - The password.
 * 
 * @returns {Object} - The response data from the API.
 * 
 * @throws {Error} - Throws an error if the API call fails.
 */
export const DocumentSaveApi = async (payload) => {
    try {
        const loginData = JSON.parse(await AsyncStorage.getItem('@loginData'));
        const response = await fetch(`${ApiConfig.url}/api/v1/sdl`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + loginData.token
            },
            body: payload,
        });

        try {
            const responseData = await response.json();
            //console.log('----------*******---------',responseData);
            return responseData;
        } catch (jsonError) {
            throw new Error(`Failed to parse response JSON: ${jsonError.message}`);
        }
    } catch (error) {
        throw new Error(`An error occurred while making the login API call: ${error.message}`);
    }
};
