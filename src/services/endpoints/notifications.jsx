import api from '../api'; 

export const getNotifications = async () => { 
    try {
        const response = await api.get(`/notifications/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pending request", error);
        return [];
    }
};

export const acceptNotifications = async (payload) => {
    try {
        console.log(payload)
        const response = await api.post(`/notifications/accept`, payload);
        return response.data
    } catch (error) {
        console.error("Error updating request", error);
        return [];
    }
}