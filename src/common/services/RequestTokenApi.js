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
export const RequestTokenApi = async (payload) => {
    try {
        const response = await fetch(`${ApiConfig.url}/api/v1/auth/token`, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider_code: payload.providerCode,
                username: payload.username,
                password: payload.password
            })
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
