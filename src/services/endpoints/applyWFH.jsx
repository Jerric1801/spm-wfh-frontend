import api from '../api';

const applyWFH = async (payload) => {
    try {
        const response = await api.post(`/apply-WFH/apply`, payload); // TO UPDATE
        return response.data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }
};

export {
    applyWFH
}