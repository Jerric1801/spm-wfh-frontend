import TopProfileBar from '../components/dashboard/TopProfileBar'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';  // Add this import
import {Table, Modal} from 'antd';
import Button from '../components/common/Button';
import ExpandButton from '../assets/images/expand.png';
import {isSameDay} from 'date-fns';


function TeamRequest() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const viewRequestDetails = (record) => {
      console.log('View details for:', record);
      setSelectedRecord(record);
      setIsModalVisible(true);
  }

  const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedRecord(null);
  }

    // low priority TODO fetch blockout dates
    const blackoutDates = [{'date':'2024-10-24','reason':'Townhall'},
        {'date':'2024-10-31','reason':'Big boss meeting'},
        {'date':'2024-11-11','reason':'Big sale!'}];

    const checkBlackoutDates = (blackoutDates,date) =>{
      console.log('checkBlackoutDates');
      const datesOnly = blackoutDates.map(bD => bD.date);
      for (var i=0; i < datesOnly.length; i++) {
        console.log(datesOnly[i]);
        console.log(new Date(datesOnly[i]));
        console.log(date);
        console.log(isSameDay(new Date(datesOnly[i]),date));
        if(isSameDay(new Date(datesOnly[i]),date)){
          return true;
        }
      }
      return false;
      
    }

    // TODO fetch data from request db
    const dataSource = [
        {
          key: '1',
          id: '35248',
          member: 'Oliver Tan',
          dateRange: '1 Oct - 29 Oct',
          wfhType: 'Morning only (AM)',
          reason: 'Happy October',
        },        
        {
            key: '2',
            id: '54342',
            member: 'Janice Chan',
            dateRange: '3 Oct - 5 Oct',
            wfhType: 'Full Day (FD)',
            reason: 'Birthday whee',
          },
          {
            key: '1',
            id: '56674',
            member: 'Mary Teo',
            dateRange: '1 Nov - 2 Nov',
            wfhType: 'Morning only (AM)',
            reason: 'Babysitting',
          },
          {
            key: '1',
            id: '79500',
            member: 'Noah Ng',
            dateRange: '20 Dec - 31 Dec',
            wfhType: 'Full Day (FD)',
            reason: 'Overseas for holiday',
          },
          {
            key: '1',
            id: '67633',
            member: 'Heng Chan',
            dateRange: '2 Nov - 24 Nov',
            wfhType: 'Afternoon only (PM)',
            reason: 'Babysitting',
          },
          {
            key: '1',
            id: '63405',
            member: 'Rina Tan',
            dateRange: '30 Oct - 2 Nov',
            wfhType: 'Full Day (FD)',
            reason: 'Halloween and Deepavali vibes are ushering me into a period of rest. Sometimes in life we need a little light in the darkness.',
          },
      ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width:'8%',
            
          },
          {
          title: 'Member',
          dataIndex: 'member',
          key: 'member',
          width:'10%',
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
          width:'20%',
          ellipsis:'true'
        },
        {
          title: 'Action',
          key: 'action',
          // Note: the colour will come when merged w Feature/ApproveWFH branch
          render: (record) => (
            <div className="flex">
              <Button color="bg-green" width="150px" text="Approve" onClick={() => approveRequest(record)}/>
              <div className="w-[10px]"></div>
              <Button color="bg-red" width="150px" text="Reject" onClick={() => rejectRequest(record)}/>
              <img src={ExpandButton} alt="Expand Button"  style={{ height:'30px',margin:'auto'}} onClick={()=>viewRequestDetails(record)}/>
              
            </div>
          ),
          width:'36%',
        },
      ];
      
    const approveRequest = (rowData) => {
        if(confirm(`Confirm approving request? 
        Request ID: ${rowData.id}
        Team member: ${rowData.member} 
        Date Range: ${rowData.dateRange} 
        WFH Type: ${rowData.wfhType}
        Reason: ${rowData.reason}\n`)){
          // TODO update request status in database, fetch success/error message
          const approvalSuccess = true;
          if (approvalSuccess){
            alert('This request has been successfully approved!');
          }
          else{
            alert('There was an error in saving your request approval, please try again.');
          }
        }
    };
      

    const rejectRequest = (rowData) => {
      let rejReason = '';
      while (rejReason==''){
        rejReason = (prompt(`Please enter your reason for rejection. 
        Request ID: ${rowData.id}
        Team member: ${rowData.member} 
        Date Range: ${rowData.dateRange} 
        WFH Type: ${rowData.wfhType}
        Reason: ${rowData.reason}\n`));
      }
      console.log(rejReason);
      if (rejReason!=null){
        // TODO: update reason into database
        // TODO update request status from database, fetch success/error message
        const rejSuccess = true;
        if (rejSuccess){
          alert('This request has been successfully rejected!');
        }
        else{
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
                <div className="w-[80%] h-[100%]" style={{padding:'20px'}}>
                <span className="text-[30px] font-bold">Team's Pending Request</span>
                <br/><br/>
                <Table columns={columns} dataSource={dataSource} />
                </div>

                <div className="w-[20%] h-[100%]" style={{padding:'5px'}}>
                    <Calendar tileDisabled={({date}) => checkBlackoutDates(blackoutDates,date) }></Calendar>
                    <div className="text-tag-grey-dark" style={{margin:'20px'}}>
                        <br/>                    
                        <span class='font-bold'>No WFH Days:</span>
                        {blackoutDates.map(blackoutDates => {
                          return (
                            <li>
                              {blackoutDates.date}: {blackoutDates.reason} 
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
                      <Button color="bg-green" width="150px" text="Approve" onClick={() => approveRequest(selectedRecord)}/>
                      <div className="w-[10px]"></div>
                      <Button color="bg-red" width="150px" text="Reject" onClick={() => rejectRequest(selectedRecord)}/>
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