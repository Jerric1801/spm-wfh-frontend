//Dashboard Components
import React, { useState, useEffect } from 'react';
import TopProfileBar from '../components/dashboard/TopProfileBar';
import { Input, Table, Modal } from 'antd';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import ExpandButton from '../assets/images/expand.png';
import { fetchRequests, withdrawRequest } from '../services/endpoints/manageRequests'

function Personal() {
    const [dataSource, setDataSource] = useState([]); // Ensure it's initialized
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [isLoading, setIsLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        const loadRequests = async () => {
            const data = await fetchRequests();
            setDataSource(data);
        };

        loadRequests();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStaffSchedule();
                // Add a unique key to each record using map
                const dataWithKeys = response.data.map((record, index) => ({
                    ...record,
                    key: record.Request_ID // You can use Request_ID as the key if it's unique
                }));
                setDataSource(dataWithKeys); 
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, []);

    const viewRequestDetails = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    }

    const handleWithdraw = (record) => {
        if (record.status !== 'Withdrawn') {
            setSelectedRecord(record);
            setIsWithdrawModalVisible(true); // Show the withdrawal modal
        }
    };

    const totalRequests = dataSource.length;
    const countByStatus = (status) => dataSource.filter(item => item.status === status).length;
    const percentageByStatus = (status) => {
        const percentage = ((countByStatus(status) / totalRequests) * 100).toFixed(0);
        return `${percentage}`;
    };

    const handleWithdrawRequest = async () => {
        if (!selectedRecord) {
            console.error("No request selected to withdraw");
            return;
        }
    
        // Prepare the payload with requestId and requestReason
        const payload = {
            requestId: selectedRecord.id,
            requestReason: withdrawReason,
        };
    
        // Call the API to withdraw the request
        const response = await withdrawRequest(payload);
    
        if (response && response.message === 'Request withdrawn successfully') {
            // Update the local state to reflect the change
            const updatedDataSource = dataSource.map((item) =>
                item.id === selectedRecord.id ? { ...item, status: 'Withdrawn' } : item
            );
    
            setDataSource(updatedDataSource);
            console.log('Withdrawing request:', selectedRecord);
            console.log('Reason:', withdrawReason);
        } else {
            console.error('Failed to withdraw request:', response);
        }
    
        // Close the modal after submission
        setIsWithdrawModalVisible(false);
        setSelectedRecord(null);
        setWithdrawReason('');
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: 'Request_ID', // Changed to Request_ID
            key: 'Request_ID',
        },
        {
            title: 'Date Range',
            key: 'dateRange',
            render: (record) => {
                const startDate = new Date(record.Start_Date).toLocaleDateString();
                const endDate = new Date(record.End_Date).toLocaleDateString();
                return `${startDate} - ${endDate}`;
            }
        },
        {
            title: 'WFH Type',
            dataIndex: 'WFH_Type', // Changed to WFH_Type
            key: 'WFH_Type',
        },
        {
            title: 'Status',
            dataIndex: 'Current_Status', // Changed to Current_Status
            key: 'Current_Status',
            render: (status) => {
                let color = '';
                if (status === 'Approved') color = 'green';
                if (status === 'Pending') color = 'orange';
                if (status === 'Rejected') color = 'red';
                if (status === 'Withdrawn') color = 'blue';
                return <Tag text={status} color={color} />;
            },
        },
        {
            title: 'Reason',
            dataIndex: 'Request_Reason', // Changed to Request_Reason
            key: 'Request_Reason',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   
                    <Button text="Withdraw" 
                    color={record.status === 'Withdrawn' ? "bg-gray" : "bg-orange"} 
                    onClick={() => handleWithdraw(record)}
                    width="100px" 
                    height="40px"
                    disabled={record.status === 'Withdrawn'}
                     />
        
                    <img 
                       src={ExpandButton} 
                       alt="Expand Button" 
                       style={{ height:'30px', width: '30px', cursor: 'pointer'}} 
                       onClick={()=>viewRequestDetails(record)}/>
                </div>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-12 grid-rows-12 gap-0 h-screen">
            {/* Top Profile Bar */}
            <div className="col-span-12 row-span-1 shadow-sm">
                <TopProfileBar />
            </div>

            {/* Main Content */}
            <div className="col-span-9 row-span-11 bg-gray-100 p-8 overflow-x-auto">
                {/* Table */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                )}
            </div>

            {/* Short Summary on the right */}
            <div className="col-span-12 lg:col-span-3 row-span-11 bg-white p-8">
    <h2 className="text-xl font-bold">Short Summary</h2>
    <div className="mt-4">
        <div className="flex justify-between items-center">
            <p className="text-lg">Requests</p>
            <p className="text-2xl font-bold">{totalRequests}</p>
        </div>
        
        {/* Progress bar with segments */}
        <div className="mt-4 w-full h-4 rounded-full overflow-hidden bg-gray-200">
            <div 
                style={{ width: `${percentageByStatus('Approved')}%` }} 
                className="h-full bg-green"
            ></div>
            <div 
                style={{ width: `${percentageByStatus('Pending')}%`,  backgroundColor: '#FFA500' }} 
                className="h-full"
            ></div>
            <div 
                style={{ width: `${percentageByStatus('Rejected')}%` }} 
                className="h-full bg-red"
            ></div>
            <div 
                style={{ width: `${percentageByStatus('Withdrawn')}%` }} 
                className="h-full bg-blue"
            ></div>
        </div>

        {/* Percentage labels */}
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-green">Approved</span>
                <span>{percentageByStatus('Approved')}%</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-orange">Pending</span>
                <span>{percentageByStatus('Pending')}%</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-red">Rejected</span>
                <span>{percentageByStatus('Rejected')}%</span>
            </div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-blue">Withdrawn</span>
                <span>{percentageByStatus('Withdrawn')}%</span>
            </div>
        </div>
    </div>
</div>
                
                {/* Modal */}
                <Modal
                title={`Details on Request #${selectedRecord?.id}`}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" text="Close" color="bg-gray" onClick={handleCloseModal} />,
                    <Button key="withdraw" text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(selectedRecord)} />,
                ]}                
            >
                {selectedRecord && (
                    <div>
                        <p><strong>Date Range:</strong> {new Date(selectedRecord.Start_Date).toLocaleDateString()} - {new Date(selectedRecord.End_Date).toLocaleDateString()}</p>
                        <p><strong>WFH Type:</strong> {selectedRecord.WFH_Type}</p>
                        <p><strong>Reason:</strong> {selectedRecord.Request_Reason}</p>
                        <SupportingDocuments documents={sampleDocuments} />
                        <p><strong>Status:</strong> <Tag text={selectedRecord.Current_Status} color={selectedRecord.Current_Status === 'Approved' ? 'green' : selectedRecord.Current_Status === 'Pending' ? 'orange' : 'red'} /></p>
                    </div>
                )}
            </Modal>

            {/* Withdraw Modal */}
            <Modal
             title={`Details on Request #${selectedRecord?.id}`}
             open={isModalVisible}
             onCancel={handleCloseModal}
             footer={[
              <Button key="close" text="Close" color="bg-gray" onClick={handleCloseModal} />,
              <Button key="withdraw" text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(selectedRecord)} />,
           ]}
            >
                <Input.TextArea
                    rows={4}
                    value={withdrawReason}
                    onChange={(e) => setWithdrawReason(e.target.value)}
                    placeholder="Enter your reason here..."
                />
            </Modal>
        </div>
    );
}

export default Personal;