import api from '../api'; 

const getPending = async () => { 
    try {
        const response = await api.get(`/manage-request/pending`); 
        return response.data;
    } catch (error) {
        console.error("Error fetching pending request", error);
        return [];
    }
};

const manageRequest = async (payload) => {
    try {
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
  
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: data should be an array');
      }
  
      // If it's a summary request (for notifications), format data accordingly
      if (isSummary) {
        return data.map((request) => ({
          id: request.Request_ID,
          status: request.Current_Status,
          dateRange: `${new Date(request.Start_Date).toLocaleDateString('en-GB')} - ${new Date(request.End_Date).toLocaleDateString('en-GB')}`,
          WFHType: request.WFH_Type,
          timestamp: request.Last_Updated // Assuming 'Last_Updated' is a suitable timestamp for the notification
        }));
      }
  
      // Otherwise, return full details
      return data.map((request, index) => ({
        key: index.toString(),
        id: request.Request_ID,
        dateRange: `${new Date(request.Start_Date).toLocaleDateString('en-GB')} - ${new Date(request.End_Date).toLocaleDateString('en-GB')}`,
        WFHType: request.WFH_Type,
        status: request.Current_Status,
        reason: request.Request_Reason,
      }));
    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  };
  

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
    getPendingCount
}