import api from '../api';

const applyWFH = async (payload) => {
    console.log("applied wfh");
    try {
        const response = await api.post(`/apply-WFH/apply`, payload);
        // Return the response data with a success flag
        console.log(response)
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error applying WFH:", error);

        // Check if the error has a response (from the server) and handle accordingly
        if (error.response) {
            // Return the error response data, including status code and message
            return {
                success: false,
                status: error.response.status,
                data: error.response.data
            };
        } else {
            // For network or unexpected errors
            return {
                success: false,
                status: null,
                data: { error: 'An unexpected error occurred' }
            };
        }
    }
};

export {
    applyWFH
}