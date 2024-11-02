import api from '../api'; 

const getPending = async () => { 
    try {
        const response = await api.get(`/manage-request/pending`);
        console.log(response)
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

const fetchRequests = async (isSummary = false) => {
    try {
      const response = await api.get(`/manage-request/getStaff`);
      const data = response.data.data;  // Extract the actual array of requests

      return data

    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  };
  
const withdrawRequest = async (payload) => {
    try {
        console.log(payload)
        const response = await api.post(`/manage-request/withdraw`, payload);

        console.log(response)
        return response.data
    } catch (error) {
        console.error("Error withdrawing request", error);
        return [];
    }
}

const getPendingCount = async (payload) => { 
    try {
        const response = await api.get(`/manage-request/pending/count`, payload); 
        return response.data;
    } catch (error) {
        console.error("Error fetching pending request", error);
        return [];
    }
};



export {
    getPending,
    manageRequest,
    fetchRequests,
    getPendingCount,
    withdrawRequest
}