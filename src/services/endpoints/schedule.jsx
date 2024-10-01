import api from '../api';

const getSchedule = async (payload) => {
    try {
        const response = await api.post(`/view-schedule/schedule`, payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
};

export {
    getSchedule
}