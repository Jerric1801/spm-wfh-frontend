function RequestModal({ request, onClose }) {
    return (
        <div className="bg-white p-6 rounded-md shadow-md w-1/2 h-1/2 relative"> 
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div>
                <h3 className="text-lg font-semibold mb-4">Request Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-medium text-gray-700">WFH Type:</p>
                        <p>{request.WFH_Type}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Status:</p>
                        <p>{request.Current_Status}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Start Date:</p>
                        <p>{new Date(request.Start_Date).toLocaleDateString()}</p> 
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">End Date:</p>
                        <p>{new Date(request.End_Date).toLocaleDateString()}</p> 
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">Request Reason:</p>
                        <p>{request.Request_Reason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestModal;