import ApiConfig from "../../api/ApiConfig";

/**
 * Makes an API call to register a code to a QR.
 *
 * @param {string} code - The code to be registered.
 * @returns {Promise<Object>} The response data from the API call.
 * @throws {Error} If the API call fails.
 */
export const registerCodeToQRApiCall = async (code) => {
    try {
        const url = `${ApiConfig.url}/api/v1/device/${code}`;
        const response = await fetch(url, {
            method: 'PUT'
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log('Error:  ', error);
        throw new Error(`An error occurred while registering code to QR: ${error.message}`);
    }
};
