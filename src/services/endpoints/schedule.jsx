import api from '../api';

const getSchedule = async (params) => {
    try {
        const response = await api.get('/view-schedule/', {
            params, // Attach query parameters here
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
};

export {
    getSchedule
}