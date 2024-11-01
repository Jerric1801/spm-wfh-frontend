import api from '../api';

// Q: is employee JWT needed?

const sendWFHRequest = async (payload) => {
    return;
    
    /*
    try {
        const response = await api.post(`/view-schedule/schedule`, payload); // TO UPDATE
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
        */
};

export {
    sendWFHRequest
}