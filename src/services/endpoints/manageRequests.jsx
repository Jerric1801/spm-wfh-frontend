import api from '../api'; 

const getPending = async () => { 
    try {
        const response = await api.get(`/manage-request/pending`);
        console.log(response.data) 
        return response.data;
    } catch (error) {
        console.error("Error fetching pending request", error);
        return [];
    }
};

const manageRequest = async (payload) => {
    try {
        console.log(payload)
        const response = await api.post(`/manage-request/`, payload);
        return response.data
    } catch (error) {
        console.error("Error updating request", error);
        return [];
    }
}


export {
    getPending,
    manageRequest
}