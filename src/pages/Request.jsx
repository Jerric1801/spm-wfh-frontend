import TopProfileBar from '../components/dashboard/TopProfileBar'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect } from 'react';  // Add this import
import { Table, Modal } from 'antd';
import Button from '../components/common/Button';
import ExpandButton from '../assets/images/expand.png';
import { isSameDay } from 'date-fns';
import { getPending, manageRequest } from '../services/endpoints/manageRequests';

//140008
//151408 Phillip Lee

function TeamRequest() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]); // State to store fetched data
  // const [blackoutDates, setBlackoutDates] = useState([]); // State to store blackout dates

  // low priority TODO fetch blockout dates
  const blackoutDates = [{ 'date': '2024-10-24', 'reason': 'Townhall' },
  { 'date': '2024-10-31', 'reason': 'Big boss meeting' },
  { 'date': '2024-11-11', 'reason': 'Big sale!' }];


  useEffect(() => {
    const fetchData = async () => {
      const pendingRequests = await getPending();
      if (pendingRequests.data) {
        setDataSource(pendingRequests.data);
      } else {
        console.log("No requests found")
      }
    };

    // TODO: Fetch blackout dates from API

    fetchData();
    // fetchBlackoutDates(); 
  }, []);


  const viewRequestDetails = (record) => {
    // console.log('View details for:', record);
    setSelectedRecord(record);
    setIsModalVisible(true);
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  }

  const checkBlackoutDates = (blackoutDates, date) => {
    const datesOnly = blackoutDates.map(bD => bD.date);
    for (var i = 0; i < datesOnly.length; i++) {
      if (isSameDay(new Date(datesOnly[i]), date)) {
        return true;
      }
    }
    return false;

  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '8%',

    },
    {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      width: '10%',
    },
    {
      title: 'Date Range',
      dataIndex: 'dateRange',
      key: 'dateRange',
    },
    {
      title: 'WFH Type',
      dataIndex: 'wfhType',
      key: 'wfhType',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: '20%',
      ellipsis: 'true'
    },
    {
      title: 'Action',
      key: 'action',
      // Note: the colour will come when merged w Feature/ApproveWFH branch
      render: (record) => (
        <div className="flex">
          <Button color="bg-green" width="150px" text="Approve" onClick={() => approveRequest(record)} />
          <div className="w-[10px]"></div>
          <Button color="bg-red" width="150px" text="Reject" onClick={() => rejectRequest(record)} />
          <img src={ExpandButton} alt="Expand Button" style={{ height: '30px', margin: 'auto' }} onClick={() => viewRequestDetails(record)} />

        </div>
      ),
      width: '36%',
    },
  ];

  const approveRequest = async (rowData) => {
    if (confirm(`Confirm approving request? 
        Request ID: ${rowData.id}
        Team member: ${rowData.member} 
        Date Range: ${rowData.dateRange} 
        WFH Type: ${rowData.wfhType}
        Reason: ${rowData.reason}\n`)) {
  
      try {
        const payload = {
          requestId: rowData.id, // Assuming 'id' holds the Request_ID
          action: 'approve',
          managerReason: null, // No reason needed for approval
        };
  
        const response = await manageRequest(payload);
        console.log(response); 
        alert('This request has been successfully approved!');

        setDataSource(prevDataSource => 
          prevDataSource.filter(record => record.id !== rowData.id)
        );
  
      } catch (error) {
        console.error('Error approving request:', error);
        alert('There was an error in saving your request approval, please try again.');
      }
    }
  };
  
  const rejectRequest = async (rowData) => {
    let rejReason = '';
    while (rejReason == '') {
      rejReason = prompt(`Please enter your reason for rejection. 
        Request ID: ${rowData.id}
        Team member: ${rowData.member} 
        Date Range: ${rowData.dateRange} 
        WFH Type: ${rowData.wfhType}
        Reason: ${rowData.reason}\n`);
    }
  
    if (rejReason != null) {
      try {
        const payload = {
          requestId: rowData.id,
          action: 'reject',
          managerReason: rejReason,
        };
  
        const response = await manageRequest(payload);
        console.log(response); 
        alert('This request has been successfully rejected!');

        setDataSource(prevDataSource => 
          prevDataSource.filter(record => record.id !== rowData.id)
        );
  
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('There was an error in saving your request rejection, please try again.');
      }
    }
  };
  
  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-0 h-screen">
      {/* Top Profile Bar */}
      <div className="col-span-12 row-span-1 shadow-sm">
        <TopProfileBar />
      </div>
      <div className="col-span-12 row-span-11 bg-gray-100 flex justify-center items-center">
        <div className="w-[80%] h-[100%]" style={{ padding: '20px' }}>
          <span className="text-[30px] font-bold">Team's Pending Request</span>
          <br /><br />
          <Table columns={columns} dataSource={dataSource} />
        </div>

        <div className="w-[20%] h-[100%]" style={{ padding: '5px' }}>
          <Calendar tileDisabled={({ date }) => checkBlackoutDates(blackoutDates, date)}></Calendar>
          <div className="text-tag-grey-dark" style={{ margin: '20px' }}>
            <br />
            <span className='font-bold'>No WFH Days:</span>
            {blackoutDates.map((blackoutDate, index) => {
              return (
                <li key={index}>
                  {blackoutDate.date}: {blackoutDate.reason}
                </li>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={`Details on Request #${selectedRecord?.id}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[<div className='flex'>
          <Button text="Close" width='150px' color="bg-gray" onClick={handleCloseModal} />
          <div className="w-[10px]"></div>
          <Button color="bg-green" width="150px" text="Approve" onClick={() => approveRequest(selectedRecord)} />
          <div className="w-[10px]"></div>
          <Button color="bg-red" width="150px" text="Reject" onClick={() => rejectRequest(selectedRecord)} />
        </div>
        ]}
      >
        {selectedRecord && (
          <div>
            <p><strong>Request ID:</strong> {selectedRecord.id}</p>
            <p><strong>Member:</strong> {selectedRecord.member}</p>
            <p><strong>Date Range:</strong> {selectedRecord.dateRange}</p>
            <p><strong>WFH Type:</strong> {selectedRecord.wfhType}</p>
            <p><strong>Reason:</strong> {selectedRecord.reason}</p>

          </div>
        )}
      </Modal>

    </div>
  );
}
export default TeamRequest