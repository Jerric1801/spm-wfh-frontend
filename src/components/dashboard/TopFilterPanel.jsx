import Button from '../common/Button';
import "../../assets/styles/applyWFHModal.css";
import { useState, useEffect, useContext } from 'react';
import { isSameDay, isBefore, setMinutes, setHours, } from 'date-fns';
import calendarData from '../../data/dashboard/calendar.json'
import { ScheduleContext } from '../../context/ScheduleContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WeekdayButton from '../applyWFH/WeekdayButton';


function TopFilterPanel({ currentMonth, startDate = new Date(), endDate = new Date() }) {
    const { setCurrentMonth } = useContext(ScheduleContext);
    const [showModal, setShowModal] = useState(false);
    const [showCalen, setShowCalen] = useState(false);
    const [modalDateRange, setModalDateRange] = useState(`${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    const [recurringDays,setrecurringDays] = useState({
        'M':false,
        'Tu':false,
        'W':false,
        'Th':false,
        'F':false,
        'Sa':false,
        'Su':false,
    })
    

    const [WFHRange,setWFHRange] = useState([new Date(),new Date()]);
    //console.log(WFHRange);
    const [WFHType,setWFHType] = useState('');
    const [WFHReason,setWFHReason] = useState('');

    const sendRequest = (event) => {
        event.preventDefault();
        let error = 0;

        /*
        if (WFHRange==[0,0]){
            alert('Please select WFH date range!');
            error +=1;
        }else{*/
        const today = new Date();
        console.log(WFHRange); //
        console.log(today); //
        /*
        console.log(today);
        console.log(isBefore(WFHRange[0],today));
        //console.log(isBefore(WFHRange[1],today));
        console.log('isSameDay');
        console.log(isSameDay(WFHRange[0],today));
        */
        if(isSameDay(WFHRange[0],today)){
            // check if now is AM
            const todayNoon = setMinutes(setHours(new Date(), 12), 0);
            if(!(isBefore(today,todayNoon) && WFHType=='Afternoon only (PM)')){
                alert('Please ensure the date range starts AFTER today. Same-day WFH arrangement is only applicable in the morning for an afternoon WFH.');
                error += 1;
            }else{
                alert('You are applying for same day WFH arrangement. Please ensure your request has been approved before going home.');
            }

        }
        else if(isBefore(WFHRange[0],today)){ //if before today 
            // TODO handle AM book for PM clause
            alert('Please ensure the date range starts AFTER today');
            error +=1;
        }
        //}


        let numDays = 0;
        console.log(recurringDays);
        for (var day in recurringDays){
            numDays += recurringDays[day] ? 1:0;
        }
        console.log(numDays);
        if (numDays ==0){
            alert('Please select at least one day in a week.');
        }
        /*
        const numDaysSelected = recurringDays.reduce((daysSelected,day)=>daysSelected+day)
        console.log(
            Object.entries(recurringDays)
            .map( ([key, value]) => `My key is ${key} and my value is ${value}` )
          )
            */


        if (WFHType==''){
            alert('Please select WFH type!');
            error +=1;
        }
        if (WFHReason==''){
            alert('Please input your reason for WFH!');
            error +=1;
        }

        if (error==0){
            if(confirm('Confirm submission of WFH request?')){
                // TODO send request to backend and fetch status
                // employee JWT
                // range,WFHType, WFHReason

                // return status success/failure to inform user
                const status = true;

                if(status){
                    alert('WFH request successfully submitted!');
                }else{
                    alert('There was an error in submitting your WFH request, please try again.');
                }
                
            }

        }
    };


    useEffect(() => {
        console.log('Update range', WFHRange);
        setModalDateRange(`${WFHRange[0].toLocaleDateString()} to ${WFHRange[1].toLocaleDateString()}`);
     }, [WFHRange]);
        

    const handleCalenButton = (e) =>{
        e.preventDefault();
        setShowCalen(!showCalen);
    }

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
                    <form onSubmit={sendRequest}>
                        <div className="flex">

                            <div className="flex flex-col" style={{marginInline:'15px'}}>
                                <div className="h-[10px]"></div>
                                <span className="text-[20px] font-bold">Date Range</span> 
                                <br/>
                                <br/>
                                <span className="text-[20px] font-bold">Days of the Week</span> 
                                <br/>
                                <br/>
                                <br/>
                                <span className="text-[20px] font-bold">WFH Type</span> 
                                <br/>
                                <br/>
                                <br/>
                                <span className="text-[20px] font-bold">Reason</span> 
                                <br/>    
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <span className="text-[20px] font-bold">Attach Files</span> 
                    
                            </div>
                        
                            <div className="flex flex-col w-[60%]">
                                <Button color="bg-white" onClick={(e)=>handleCalenButton(e)} text={modalDateRange}></Button>
                                
                                <div className="col-span-9 row-span-9 shadow-md">
                                {showCalen &&<Calendar style={{zIndex:'100001',position:'absolute',top:'100%',left:'0'}} 
                                selectRange={true} 
                                onChange={setWFHRange}
                                    />
                                }
                                </div>
                                <br/>
                                <br/>

                                <div>
                                    <WeekdayButton weekday='M' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='Tu' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='W' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='Th' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='F' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='Sa' setrecurringDays={setrecurringDays}/>
                                    <WeekdayButton weekday='Su' setrecurringDays={setrecurringDays}/>
                                </div>

                                <br/>
                                <br/>
                                <select className="rounded-[10px] h-[50px] font-bold border-2" style={{padding:'10px'}} value={WFHType} onChange={(e)=>setWFHType(e.target.value)}>
                                    <option  selected></option>
                                    <option>Full Day (FD)</option>
                                    <option>Morning only (AM)</option>
                                    <option>Afternoon only (PM)</option>
                                </select>
                                <br/>
                                <br/>
                                <textarea className="w-[250px] h-[150px] rounded-[10px]" style={{padding:'10px'}}  value={WFHReason} onChange={(e)=>setWFHReason(e.target.value)}></textarea>

                                <br/>
                                <br/>
                                <input type='file'></input>

                            </div>
                        </div>

                        <br/>
                        <br/>


                        <div className="center-div">
                            <Button text="Send Request" color="bg-green text-white" onClick={() => sendRequest()} />
                            <br/>
                            <br/>
                            <Button text="x Close" color="bg-tag-grey-dark text-white" onClick={() => setShowModal(false)} />
                        </div>
                        <br/>
                    </form>
                </div>
            </div>
        )}

        </>
    );
}

export default TopFilterPanel;