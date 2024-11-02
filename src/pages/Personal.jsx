//Dashboard Components
import React, { useState } from 'react';
import TopProfileBar from '../components/dashboard/TopProfileBar';
import { Input, Table, Modal } from 'antd';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag'; 
import ExpandButton from '../assets/images/expand.png';
import SupportingDocuments from '../components/request/SupportingDocumentsModal';

function Personal() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null); 
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState(''); // State to store the withdrawal reason

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

    const dataSource = [
        {
            key: '1',
            id: '48899',
            dateRange: '28 Oct - 29 Oct',
            WFHType: 'AM',
            status: 'Pending',
            reason: 'Deepavali Prep',
        },
        {
            key: '2',
            id: '56777',
            dateRange: '3 Oct - 5 Oct',
            WFHType: 'FD',
            status: 'Pending',
            reason: 'Birthday',
        },
        {
            key: '3',
            id: '66004',
            dateRange: '20 Sep - 22 Sep',
            WFHType: 'AM',
            status: 'Approved',
            reason: 'Babysitting',
        },
        {
            key: '4',
            id: '35804',
            dateRange: '16 Sep - 17 Sep',
            WFHType: 'FD',
            status: 'Approved',
            reason: 'Child Care',
        },
        {
            key: '5',
            id: '54904',
            dateRange: '9 Sep - 13 Sep',
            WFHType: 'PM',
            status: 'Rejected',
            reason: 'Babysitting',
        },
        {
            key: '6',
            id: '31234',
            dateRange: '20 Aug - 25 Aug',
            WFHType: 'FD',
            status: 'Approved',
            reason: 'Dogsitting',
        },
    ];

    const viewRequestDetails =(record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
    }

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedRecord(null);
    }

    const handleWithdraw = (record) => {
        setSelectedRecord(record);
        setIsWithdrawModalVisible(true);  // Show the withdrawal modal
    };

    const handleWithdrawRequest = () => {
        // For now, we simply log the selected record and reason
        console.log('Withdrawing request:', selectedRecord);
        console.log('Reason:', withdrawReason);

        // Close the modal after submission
        setIsWithdrawModalVisible(false);
        setSelectedRecord(null);
    };
    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date Range',
            dataIndex: 'dateRange',
            key: 'dateRange',
        },
        {
            title: 'WFH Type',
            dataIndex: 'WFHType',
            key: 'WFHType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button text="Change" color ="bg-lightblue" onClick={() => changeRequest(record)} width="100px" height="40px" />
                    <Button text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(record)} width="100px" height="40px" />
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
                <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>

            {/* Short Summary on the right */}
            <div className="col-span-12 lg:col-span-3 row-span-11 bg-white p-8">
                <h2 className="text-xl font-bold">Short Summary</h2>
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <p className="text-lg">Requests</p>
                        <p className="text-2xl font-bold">60</p>
                    </div>
                    <div className="mt-6">
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
                open ={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button text="Close" color="bg-gray" onClick={handleCloseModal} />,
                    <Button text="Withdraw" color="bg-orange" onClick={() => handleWithdraw(selectedRecord)} />,
                    <Button text="Change" color="bg-lightblue" onClick={() => changeRequest(selectedRecord)} />,
                ]}
            >
                {selectedRecord && (
                    <div>
                        <p><strong>Date Range:</strong> {selectedRecord.dateRange}</p>
                        <p><strong>WFH Type:</strong> {selectedRecord.WFHType}</p>
                        <p><strong>Reason:</strong> {selectedRecord.reason}</p>
                        {/* <SupportingDocuments documents={selectedRecord.supportingDocuments} /> */}
                        <SupportingDocuments documents={sampleDocuments}/>
                        <p><strong>Status:</strong> <Tag text={selectedRecord.status} color={selectedRecord.status === 'Approved' ? 'green' : selectedRecord.status === 'Pending' ? 'orange' : 'red'} /></p>
                        {/* Add more fields here as necessary */}
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

