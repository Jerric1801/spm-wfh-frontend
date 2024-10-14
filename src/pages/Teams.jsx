import TopProfileBar from '../components/dashboard/TopProfileBar'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {Table} from 'antd';
import Button from '../components/common/Button';
import ExpandButton from '../assets/images/expand.png';


function TeamRequest() {
    // low priority TODO fetch blockout dates
    const blackoutDates = [new Date('2024-10-24').getDate(),new Date('2024-10-31').getDate()];

    // TODO fetch data from request db
    const dataSource = [
        {
          key: '1',
          id: '35248',
          member: 'Oliver Tan',
          dateRange: '1 Oct - 29 Oct',
          WFHType: 'Morning only (AM)',
        Reason: 'Happy October',
        },        
        {
            key: '2',
            id: '54342',
            member: 'Janice Chan',
            dateRange: '3 Oct - 5 Oct',
            WFHType: 'Full Day (FD)',
          Reason: 'Birthday whee',
          },
          {
            key: '1',
            id: '56674',
            member: 'Mary Teo',
            dateRange: '1 Nov - 2 Nov',
            WFHType: 'Morning only (AM)',
          Reason: 'Babysitting',
          },
          {
            key: '1',
            id: '79500',
            member: 'Noah Ng',
            dateRange: '20 Dec - 31 Dec',
            WFHType: 'Full Day(FD)',
          Reason: 'Overseas for holiday',
          },
          {
            key: '1',
            id: '67633',
            member: 'Heng Chan',
            dateRange: '2 Nov - 24 Nov',
            WFHType: 'Afternoon only (PM)',
          Reason: 'Babysitting',
          },
          {
            key: '1',
            id: '63405',
            member: 'Rina Tan',
            dateRange: '30 Oct - 2 Nov',
            WFHType: 'Full Day (FD)',
            Reason: 'Halloween and Deepavali vibes...',
          },
      ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
          },
          {
          title: 'Member',
          dataIndex: 'member',
          key: 'member',
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
          title: 'Reason',
          dataIndex: 'Reason',
          key: 'Reason',
        },
        {
          title: 'Action',
          key: 'action',
          // Note: the colour will come when merged w Feature/ApproveWFH branch
          render: (record) => (
            <div className='flex'>
            
            <Button color="bg-green" width='150px' text="Approval" onClick={() => approveRequest(record)}/>
            <Button color="bg-red"  width='150px' text="Reject" onClick={() => rejectRequest(record)}/>
            <img src={ExpandButton} alt="Expand Button"  style={{ height:'30px',margin:'auto'}} onClick={()=>viewRequestDetails(record)}/>
            
            </div>
          ),
        },
      ];
      
    const approveRequest = (rowData) => {
        console.log('Action clicked for:', rowData);
    };
      

    const rejectRequest = (rowData) => {
        console.log('Action clicked for:', rowData);
    };
      
    const viewRequestDetails = (rowData) => {
        console.log('View details for:', rowData);
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
                <Table columns={columns} dataSource={dataSource} className=""/>
                </div>

                <div className="w-[20%] h-[100%]" style={{padding:'5px'}}>
                    <Calendar tileDisabled={({date}) => blackoutDates.includes(date.getDate()) }></Calendar>
                    <div className="text-tag-grey-dark">
                        <br/>                    
                        <span>No WFH Days:</span>
                        <ul>
                            <li>2024-10-24 Townhall</li>
                            <li>2024-10-31 Big boss meeting</li>
                        </ul>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
export default TeamRequest