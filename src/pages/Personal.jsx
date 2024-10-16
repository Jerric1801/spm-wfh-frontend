//Dashboard Components
import TopProfileBar from '../components/dashboard/TopProfileBar';
import { Table } from 'antd';
import Button from '../components/common/Button';
import Tag from '../components/common/Tag'; // Use your Tag component

function Personal() {
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
            render: () => (
                <>
                    <Button text="Change" width="100px" height="40px" />
                    <Button text="Withdraw" width="100px" height="40px" />
                </>
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
            <div className="col-span-9 row-span-11 bg-gray-100 p-8">
                {/* Table */}
                <Table dataSource={dataSource} columns={columns} pagination={false} />
            </div>

            {/* Short Summary on the right */}
            <div className="col-span-3 row-span-11 bg-white p-8">
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
        </div>
    );
}

export default Personal;
