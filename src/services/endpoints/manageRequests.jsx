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

const fetchRequests = async (payload) => {
    try {
        const response = await api.get(`/manage-request/getStaff`, payload); 
        const data = response.data;

        // Format the data to match the table display
        const formattedData = data.map((request, index) => {
            // Format date range
            const startDate = new Date(request.Start_Date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
            const endDate = new Date(request.End_Date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            // Map WFH Type
            const wfhTypeMap = {
                'FD': 'FD',
                'AM': 'AM',
                'PM': 'PM',
                'WD': 'FD' 
            };
            const formattedWFHType = wfhTypeMap[request.WFH_Type] || request.WFH_Type;

            // Return the formatted object
            return {
                key: index.toString(),
                id: request.Request_ID,
                dateRange: `${startDate} - ${endDate}`,
                WFHType: formattedWFHType,
                status: request.Current_Status,
                reason: request.Request_Reason,
            };
        });

        setDataSource(formattedData);
    } catch (error) {
        console.error('Error fetching requests:', error);
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