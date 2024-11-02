//Dashboard Components
import React, { useState, useEffect } from 'react';
import TopProfileBar from '../components/dashboard/TopProfileBar';
import { Input, Table, Modal } from 'antd';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag';
import ExpandButton from '../assets/images/expand.png';
import SupportingDocuments from '../components/request/SupportingDocumentsModal';
import { getStaffSchedule } from '../services/endpoints/manageRequests';

function Personal() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [dataSource, setDataSource] = useState([]); // State to store fetched data
    const [isLoading, setIsLoading] = useState(true); // State to manage loading state

    const sampleDocuments = [
        {
            fileName: "Project_Report.pdf",
            fileUrl: "https://example.com/documents/project_report.pdf"
        },
        {
            fileName: "Meeting_Minutes.docx",
            fileUrl: "https://example.com/documents/meeting_minutes.docx"
        },
        {
            fileName: "Budget_Summary.xlsx",
            fileUrl: "https://example.com/documents/budget_summary.xlsx"
        }
    ];

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
        setSelectedRecord(record);
        setIsWithdrawModalVisible(true);
    };

    const handleWithdrawRequest = () => {
        console.log('Withdrawing request:', selectedRecord);
        console.log('Reason:', withdrawReason);

        setIsWithdrawModalVisible(false);
        setSelectedRecord(null);
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
                    <Button text="Change" color="bg-lightblue" onClick={() => changeRequest(record)} width="100px" height="40px" />
                    <Button text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(record)} width="100px" height="40px" />
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
                        <p className="text-2xl font-bold">{dataSource.length}</p> {/* Dynamically show total requests */}
                    </div>
                    <div className="mt-6">
                        {/* You'll need to calculate these percentages based on the fetched data */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-green-500">Approved</span>
                            <span>50%</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-orange-500">Pending</span>
                            <span>33%</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-red-500">Rejected</span>
                            <span>17%</span>
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
                    <Button text="Close" color="bg-gray" onClick={handleCloseModal} />,
                    <Button text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(selectedRecord)} />,
                    <Button text="Change" color="bg-lightblue" onClick={() => changeRequest(selectedRecord)} />,
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
                title="Please enter your reason for withdrawal:"
                open={isWithdrawModalVisible}
                onCancel={() => setIsWithdrawModalVisible(false)}
                footer={[
                    <Button text="Cancel" color="bg-gray" onClick={() => setIsWithdrawModalVisible(false)} />,
                    <Button text="Withdraw Request" color="bg-orange" onClick={handleWithdrawRequest} />,
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