import Button from '../common/Button';
import "../../assets/styles/applyWFHModal.css";
import { useState, useEffect, useContext } from 'react';
import { isSameDay } from 'date-fns';
import calendarData from '../../data/dashboard/calendar.json'
import { ScheduleContext } from '../../context/ScheduleContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function TopFilterPanel({ currentMonth, startDate = new Date(), endDate = new Date() }) {
    const { setCurrentMonth } = useContext(ScheduleContext);
    const [showModal, setShowModal] = useState(false);
    const [showCalen, setShowCalen] = useState(false);
    const [modalDateRange, setModalDateRange] = useState(`${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

    const sendRequest = () =>{
        // TODO 
    };

    const handleMonthChange = (direction) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate); 
    };

    const tempData = calendarData;

    const [stats, setStats] = useState({
        inOffice: 0,
        wfh: 0,
        away: 0
    });

    useEffect(() => {
        if (startDate && endDate && isSameDay(startDate, endDate)) {
            // Single day selected
            const singleDayData = tempData.find(item => isSameDay(new Date(item.date), startDate));

            if (singleDayData) {
                setStats({
                    inOffice: singleDayData.wfhPercentage.in,
                    wfh: singleDayData.wfhPercentage.wfh,
                    away: 0
                });
            } else {
                setStats({ inOffice: 0, wfh: 0, away: 0 });
            }
        } else {
            const filteredData = tempData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });

            const totalDays = filteredData.length;
            let totalInOfficePercentage = 0;
            let totalWfhPercentage = 0;

            filteredData.forEach(item => {
                totalInOfficePercentage += item.wfhPercentage.in;
                totalWfhPercentage += item.wfhPercentage.wfh;
            });

            const averageInOfficePercentage = totalInOfficePercentage / totalDays;
            const averageWfhPercentage = totalWfhPercentage / totalDays;

            setStats({
                inOffice: averageInOfficePercentage,
                wfh: averageWfhPercentage,
                away: 0,
            });
        }
    }, [startDate, endDate, currentMonth]); // Re-calculate stats when selectedDateRange or currentMonth changes

    const total = stats.inOffice + stats.wfh + stats.away;

    return (
        <>
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
                    {stats.inOffice > 0 && (
                        <div
                            className="h-full bg-green flex justify-center align-center transition-all duration-300 ease-in-out" // Add transition class here
                            style={{ width: `${(stats.inOffice / total) * 100}%` }}
                        >
                            <span className="text-white ml-2 text-xs">{stats.inOffice.toFixed(1)}%</span>
                        </div>
                    )}
                    {stats.wfh > 0 && (
                        <div
                            className="h-full bg-orange flex justify-center align-center transition-all duration-300 ease-in-out" // Add transition class here
                            style={{ width: `${(stats.wfh / total) * 100}%` }}
                        >
                            <span className="text-white ml-2 text-xs">{stats.wfh.toFixed(1)}%</span>
                        </div>
                    )}
                    {stats.away > 0 && (
                        <div
                            className="h-full bg-red flex justify-center align-center transition-all duration-300 ease-in-out" // Add transition class here
                            style={{ width: `${(stats.away / total) * 100}%` }}
                        >
                            <span className="text-white ml-2 text-xs">{stats.away.toFixed(0)}%</span>
                        </div>
                    )}
                </div>
                <div className="mt-2 flex flex-start gap-3 w-full"> 
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-green mr-1 "></div>
                        <span>In Office</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange mr-1"></div>
                        <span>WFH</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red mr-1"></div>
                        <span>Away</span>
                    </div>
                </div>
            </div>
            <div className="w-[25%] h-[100%] flex flex-col justify-center items-center overflow-hidden">
                <Button text="Apply WFH" onClick={()=>setShowModal(true)} />
                <div className="mt-3 border border-gray-300 rounded-[10px] p-3 font-bold ">
                    {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                </div>
            </div>
        </div>

        {showModal &&(
            <div className="modal">
                <div onClick={()=>setShowModal(false)} className="overlay"></div>
                <div className="modal-content flex flex-col justify-center">
                    <div className="text-center">
                        <span className="w-full text-[30px] font-bold">Apply for WFH</span>
                    </div>
                    <br/>
                    <br/>

                    <div className="flex">

                        <div className="flex flex-col" style={{marginInline:'15px'}}>
                            <div className="h-[10px]"></div>
                            <span className="text-[20px] font-bold">Date Range</span> 
                            <br/>
                            <br/>
                            <br/>
                            <span className="text-[20px] font-bold">WFH Type</span> 
                            <br/>
                            <br/>
                            <br/>
                            <span className="text-[20px] font-bold">Reason</span> 
                
                        </div>
                    
                        <div className="flex flex-col w-[60%]">
                            <Button color="bg-white" onClick={()=>setShowCalen(!showCalen)} text={modalDateRange}></Button>
                            
                            <div className="col-span-9 row-span-9 shadow-md">
                            {showCalen &&<Calendar style={{zIndex:'1',position:'absolute'}} selectRange={true} onChange={(range)=>setModalDateRange(`${range[0].toLocaleDateString()} to ${range[1].toLocaleDateString()}`)}
                                />
                            }
                            </div>

                            <br/>
                            <br/>
                            <select className="rounded-[10px] h-[50px] font-bold border-2" style={{padding:'10px'}}>
                                <option>Full Day (FD)</option>
                                <option>Morning only (AM)</option>
                                <option>Afternoon only (PM)</option>
                            </select>
                            <br/>
                            <br/>
                            <textarea className="w-[250px] h-[150px] rounded-[10px]" style={{padding:'10px'}}></textarea>


                        </div>
                    </div>

                    <br/>
                    <br/>


                    <div className="center-div">
                    <Button text="Send Request" color="bg-tag-green-dark text-white" onClick={() => sendRequest()} />
                    <br/>
                    <br/>
                    <Button text="x Close" color="bg-tag-grey-dark text-white" onClick={() => setShowModal(false)} />
                    </div>
                    <br/>
                </div>
            </div>
        )}

        </>
    );
}

export default TopFilterPanel;