import Button from '../common/Button';
import { useState } from 'react'; 

function TopFilterPanel({ currentMonth, setCurrentMonth, startDate = new Date(), endDate = new Date() }) { 
    const handleMonthChange = (direction) => {
        const newDate = new Date(currentMonth); 
        newDate.setMonth(newDate.getMonth() + direction); 
        setCurrentMonth(newDate); 
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
            <div className="w-[20%] h-[100%] flex flex-col flex-start justify-center pl-2 gap-2"> 
                <span className="w-full text-[30px] font-bold">{currentMonth.toLocaleString('default', { month: 'long' })} </span>
                <div className="w-[60%] h-[30%] flex gap-2 justify-center align-center">
                    <button onClick={() => handleMonthChange(-1)} className="bg-black text-white w-[50%] h-full rounded-md text-[25px] p-0 m-0"> {'<'} </button> 
                    <button onClick={() => handleMonthChange(1)} className="bg-black text-white w-[50%] h-full rounded-md text-[25px] p-0 m-0"> {'>'} </button> 
                </div>
            </div>
            <div className="w-[50%] h-[100%] text-left flex flex-col justify-center items-center font-bold"> 
                <div className="mb-2  w-full">In Office</div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex flex-row">
                    <div 
                        className="h-full bg-blue-500 flex justify-center align-center" 
                        style={{ width: `${(stats.inOffice / total) * 100}%` }}
                    >
                        <span className="text-white ml-2 text-xs">{stats.inOffice}%</span> 
                    </div>
                    <div 
                        className="h-full bg-yellow-500 flex justify-center align-center" 
                        style={{ width: `${(stats.wfh / total) * 100}%` }}
                    >
                        <span className="text-white ml-2 text-xs">{stats.wfh}%</span> 
                    </div>
                    <div 
                        className="h-full bg-red-500 flex justify-center align-center" 
                        style={{ width: `${(stats.away / total) * 100}%` }}
                    >
                        <span className="text-white ml-2 text-xs">{stats.away}%</span> 
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
            <div className="w-[25%] h-[100%] flex flex-col justify-center items-center"> 
                <Button text="Apply WFH"/>
                <div className="mt-3 border border-gray-300 rounded-[10px] p-3 font-bold">
                    {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}

export default TopFilterPanel;