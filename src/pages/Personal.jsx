//Dashboard Components
import React, { useState, useEffect } from 'react';
import TopProfileBar from '../components/dashboard/TopProfileBar';
import { Input, Table, Modal, message } from 'antd';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import ExpandButton from '../assets/images/expand.png';
import { fetchRequests, withdrawRequest } from '../services/endpoints/manageRequests';
import SupportingDocuments from '../components/request/SupportingDocumentsModal';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

function Personal() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Instantiate useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchRequests();
                const dataWithKeys = response.map((record) => {
                    // Process recurring dates
                    const recurringDates = record.Recurring_Dates || [];
                    const formattedRecurringDates = recurringDates.length > 0 ? recurringDates.join(', ') : 'N.A.';
                    return {
                        ...record,
                        key: record.Request_ID,
                        recurringDates: formattedRecurringDates,
                        document: record.Documents ? record.Documents.map(docUrl => ({
                            fileName: docUrl.split('/').pop(),
                            fileUrl: docUrl
                        })) : []
                    };
                });

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
        setIsWithdrawModalVisible(false);
        setSelectedRecord(null);
        setWithdrawReason(''); // Clear the withdraw reason
    }

    const handleWithdraw = (record) => {
        if (record.Current_Status === 'Withdrawn') {
            message.error('This request has already been withdrawn.');
        } else {
            setSelectedRecord(record);
            setIsWithdrawModalVisible(true);
        }
    };

    const totalRequests = dataSource.length;

    const countByStatus = dataSource.reduce((acc, item) => {
        acc[item.Current_Status] = (acc[item.Current_Status] || 0) + 1;
        return acc;
    }, {});

    const percentageByStatus = (status) => {
        const count = countByStatus[status] || 0;
        const percentage = ((count / totalRequests) * 100).toFixed(0);
        return `${percentage}`;
    };


    const handleWithdrawRequest = async (isPartialWithdraw) => {
        if (!selectedRecord) {
            console.error("No request selected to withdraw");
            return;
        }

        try {
            const payload = {
                requestId: selectedRecord.Request_ID,
                requestReason: withdrawReason,
                partial: isPartialWithdraw, // Flag to indicate if it's a partial withdraw
            };

            const response = await withdrawRequest(payload);

            if (response && response.message === 'Request withdrawn successfully') {
                const updatedDataSource = dataSource.map((item) =>
                    item.Request_ID === selectedRecord.Request_ID
                        ? { ...item, Current_Status: 'Partially Withdrawn' } // Change the status if partial
                        : item
                );
                setDataSource(updatedDataSource);
                message.success('Request partially withdrawn successfully.');

                if (isPartialWithdraw) {
                    // Route to the dashboard on partial withdrawal
                    navigate('/dashboard?showModal=true');
                }
            } else {
                console.error('Failed to withdraw request:', response);
                message.error('Failed to withdraw request.');
            }
        } catch (error) {
            console.error('Error withdrawing request:', error);
            message.error('An error occurred while withdrawing the request.');
        }

        setIsWithdrawModalVisible(false);
        setSelectedRecord(null);
        setWithdrawReason('');
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'Request_ID',
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
            title: 'Recurring Days',
            dataIndex: 'recurringDates',
            key: 'recurringDates',
        },

        {
            title: 'WFH Type',
            dataIndex: 'WFH_Type',
            key: 'WFH_Type',
        },
        {
            title: 'Status',
            dataIndex: 'Current_Status',
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
            dataIndex: 'Request_Reason',
            key: 'Request_Reason',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    <Button text="Withdraw"
                        color={record.Current_Status === 'Withdrawn' ? "bg-gray" : "bg-orange"}
                        onClick={() => handleWithdraw(record)}
                        width="100px"
                        height="40px"
                        disabled={record.Current_Status === 'Withdrawn'}
                    />

                    <img
                        src={ExpandButton}
                        alt="Expand Button"
                        style={{ height: '30px', width: '30px', cursor: 'pointer' }}
                        onClick={() => viewRequestDetails(record)} />
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

                    <div className="mt-4 w-full h-4 rounded-full overflow-hidden bg-gray-200">
                        <div
                            style={{ width: `${percentageByStatus('Approved')}%` }}
                            className="h-full bg-green"
                        ></div>
                        <div
                            style={{ width: `${percentageByStatus('Pending')}%`, backgroundColor: '#FFA500' }}
                            className="h-full bg-orange"
                        ></div>
                        <div
                            style={{ width: `${percentageByStatus('Rejected')}%` }}
                            className="h-full bg-red"
                        ></div>
                        <div
                            style={{ width: `${percentageByStatus('Withdrawn')}%` }}
                            className="h-full bg-blue-500"
                        ></div>
                    </div>

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
                title={`Details on Request #${selectedRecord?.Request_ID}`}
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" text="Close" color="bg-gray" onClick={handleCloseModal} />,
                ]}
            >
                {selectedRecord && (
                    <div>
                        <p><strong>Date Range:</strong> {new Date(selectedRecord.Start_Date).toLocaleDateString()} - {new Date(selectedRecord.End_Date).toLocaleDateString()}</p>
                        <p><strong>WFH Type:</strong> {selectedRecord.WFH_Type}</p>
                        <p><strong>Reason:</strong> {selectedRecord.Request_Reason}</p>
                        <p><strong>Recurring Days:</strong> {selectedRecord.recurringDates}</p>
                        <div><strong>Status:</strong> <Tag text={selectedRecord.Current_Status} color={selectedRecord.Current_Status === 'Approved' ? 'green' : selectedRecord.Current_Status === 'Pending' ? 'orange' : 'red'} /></div>
                        <SupportingDocuments documents={selectedRecord.document} />
                    </div>
                )}
            </Modal>

            {/* Withdraw Modal */}
            <Modal
                title="Withdraw Request"
                open={isWithdrawModalVisible}
                onCancel={handleCloseModal}
                footer={
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            {/* Pass true to handle partial withdraw */}
                            <Button key="partialWithdraw" text="Partial Withdraw" color="bg-blue-500" onClick={() => handleWithdrawRequest(true)} />
                            <Button key="withdraw" text="Full Withdraw" color="bg-orange" onClick={() => handleWithdrawRequest(false)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button key="close" text="Close" color="bg-gray" onClick={handleCloseModal} />
                        </div>
                    </div>
                }
            >
                <Input.TextArea
                    rows={4}
                    value={withdrawReason}
                    onChange={(e) => setWithdrawReason(e.target.value)}
                    placeholder="Enter your reason for withdrawing..."
                />
            </Modal>
        </div>
    );
}

export default Personal;