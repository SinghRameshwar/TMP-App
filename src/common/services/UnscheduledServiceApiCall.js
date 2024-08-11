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
export const UnscheduledServiceApiCall = async (payload) => {
    try {
        const loginData = JSON.parse(await AsyncStorage.getItem('@loginData'));
        const response = await fetch(`${ApiConfig.url}/api/v1/clients/${payload.clientId}/services`, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loginData.token
            },
        });

        try {
            const responseData = await response.json();
            return responseData;
        } catch (jsonError) {
            throw new Error(`Failed to parse response JSON: ${jsonError.message}`);
        }
    } catch (error) {
        throw new Error(`An error occurred while making the login API call: ${error.message}`);
    }
};
