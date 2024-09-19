import Button from '../common/Button';
import { useState } from 'react'; // Import useState

function TopFilterPanel({ startDate = new Date(), endDate = new Date() }) { // Assuming startDate & endDate are passed as props
    const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' })); 

    const handleMonthChange = (direction) => {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + direction);
        setCurrentMonth(currentDate.toLocaleString('default', { month: 'long' }));
    };

    // Dummy data for progress bar (replace with actual data)
    const stats = {
        inOffice: 60,
        wfh: 30,
        away: 10,
    };

    const total = stats.inOffice + stats.wfh + stats.away;

    return (
        <div className="w-[100%] h-[100%] flex gap-10 flex-row p-2">
            <div className="w-[20%] h-[100%] flex flex-col flex-start justify-center pl-2 gap-2"> {/* Center content */}
                <span className="w-full text-[30px]">{currentMonth}</span>
                <div className="w-[60%] h-[35%] flex gap-2">
                    <button onClick={() => handleMonthChange(-1)} className="bg-black text-white w-[50%] h-full rounded-md"> {'<'} </button> 
                    <button onClick={() => handleMonthChange(1)} className="bg-black text-white w-[50%] h-full rounded-md"> {'>'} </button> 
                </div>
            </div>
            <div className="w-[50%] h-[100%] text-left flex flex-col justify-center items-center font-bold"> {/* Center content */}
                <div className="mb-2  w-full">In Office</div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex flex-row">
                    <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${(stats.inOffice / total) * 100}%` }}
                    >
                        {/* <span className="text-white ml-2">{stats.inOffice}%</span>  */}
                    </div>
                    <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${(stats.wfh / total) * 100}%` }}
                    >
                        {/* <span className="text-white ml-2">{stats.wfh}%</span>  */}
                    </div>
                    <div 
                        className="h-full bg-red-500" 
                        style={{ width: `${(stats.away / total) * 100}%` }}
                    >
                        {/* <span className="text-white ml-2">{stats.away}%</span>  */}
                    </div>
                </div>
                <div className="mt-2 flex flex-start gap-3 w-full"> {/* Legend */}
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 mr-1 "></div>
                        <span>In Office</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
                        <span>WFH</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 mr-1"></div>
                        <span>Away</span>
                    </div>
                </div>
            </div>
            <div className="w-[25%] h-[100%] flex flex-col justify-center items-center"> {/* Center content */}
                <Button text="Apply WFH">Some Action</Button> {/* Replace with actual button content */}
                <div className="mt-2 border border-gray-300 rounded p-2">
                    {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}

export default TopFilterPanel;