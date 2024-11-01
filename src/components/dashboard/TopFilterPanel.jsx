import Button from '../common/Button';
import "../../assets/styles/applyWFHModal.css";
import { useState, useEffect, useContext } from 'react';
import { isSameDay, isBefore, setMinutes, setHours, format, startOfMonth } from 'date-fns';
import calendarData from '../../data/dashboard/calendar.json'
import { ScheduleContext } from '../../context/ScheduleContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WeekdayButton from '../applyWFH/WeekdayButton';
import FileUploadMultiple from '../applyWFH/UploadFiles';

function TopFilterPanel({ setSelectedDateRange, currentMonth, startDate = new Date(), endDate = new Date() }) {
    const { setCurrentMonth, fetchParams } = useContext(ScheduleContext);
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
    
    const [WFHRange, setWFHRange] = useState([new Date(), new Date()]);
    const [WFHType, setWFHType] = useState('');
    const [WFHReason, setWFHReason] = useState('');

    const sendRequest = (event) => {
        event.preventDefault();
        let error = 0;

        /*
        if (WFHRange==[0,0]){
            alert('Please select WFH date range!');
            error +=1;
        }else{*/
        const today = new Date();
        /*
        console.log(today);
        console.log(isBefore(WFHRange[0],today));
        //console.log(isBefore(WFHRange[1],today));
        console.log('isSameDay');
        console.log(isSameDay(WFHRange[0],today));
        */
        if (isSameDay(WFHRange[0], today)) { // handle AM apply PM WFH special case
            // check if now is AM
            const todayNoon = setMinutes(setHours(new Date(), 12), 0);
            if (!(isBefore(today, todayNoon) && WFHType == 'Afternoon only (PM)')) {
                alert('Please ensure the date range starts AFTER today. Same-day WFH arrangement is only applicable in the morning for an afternoon WFH.');
                error += 1;
            } else {
                alert('You are applying for same day WFH arrangement. Please ensure your request has been approved before going home.');
            }

        }
        else if (isBefore(WFHRange[0], today)) { //if before today 
            alert('Please ensure the date range starts AFTER today');
            error += 1;
        }
        //}


        let numDays = 0;
        console.log(recurringDays);
        for (var day in recurringDays){
            numDays += recurringDays[day] ? 1:0;
        }
        //console.log(numDays);
        if (numDays ==0){
            alert('Please select at least one day in a week.');
            error +=1;
        }


        if (WFHType == '') {
            alert('Please select WFH type!');
            error += 1;
        }
        if (WFHReason == '') {
            alert('Please input your reason for WFH!');
            error += 1;
        }

        if (error == 0) {
            if (confirm('Confirm submission of WFH request?')) {
                // TODO send request to backend and fetch status
                // employee JWT
                // range,WFHType, WFHReason

                // return status success/failure to inform user
                const status = true;

                if (status) {
                    alert('WFH request successfully submitted!');
                } else {
                    alert('There was an error in submitting your WFH request, please try again.');
                }

            }

        }
    };

    useEffect(() => {
        setModalDateRange(`${WFHRange[0].toLocaleDateString()} to ${WFHRange[1].toLocaleDateString()}`);
    }, [WFHRange]);


    const handleCalenButton = (e) => {
        e.preventDefault();
        setShowCalen(!showCalen);
    }

    const handleMonthChange = (direction) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate);
        const firstDayOfMonth = startOfMonth(newDate);
        setSelectedDateRange({ start: firstDayOfMonth, end: firstDayOfMonth });
    };


    const [stats, setStats] = useState({
        inOffice: 0,
        wfh: 0
    });

    useEffect(() => {
        let filteredData = fetchParams.filteredData;

        // Apply department and team filters from fetchParams
        if (fetchParams.department) {
            filteredData = filteredData.map(item => ({
                ...item,
                departments: item.departments.filter(d => d.department === fetchParams.department)
            }));
        }
        if (fetchParams.team) {
            filteredData = filteredData.map(item => ({
                ...item,
                departments: item.departments.map(dept => ({
                    ...dept,
                    teams: dept.teams.filter(t => t.team === fetchParams.team)
                }))
            }));
        }

        if (startDate && endDate && isSameDay(startDate, endDate)) {
            // Single day selected
            const targetDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
            const targetDate = targetDateUTC.toISOString().split('T')[0];
            const singleDayData = filteredData.find(item => item.date === targetDate);

            if (singleDayData) {
                let inOffice = 0;
                let wfh = 0;

                singleDayData.departments.forEach(dept => {
                    dept.teams.forEach(team => {
                        team.members.forEach(member => {
                            if (member.WFH_Type === 'IN') {
                                inOffice++;
                            } else {
                                wfh++;
                            }
                        });
                    });
                });

                const totalMembers = inOffice + wfh;
                const inOfficePercentage = (inOffice / totalMembers) * 100 || 0; // Calculate percentage
                const wfhPercentage = (wfh / totalMembers) * 100 || 0; // Calculate percentage

                setStats({
                    inOffice: inOfficePercentage,
                    wfh: wfhPercentage,
                    away: 0
                });
            } else {
                setStats({ inOffice: 0, wfh: 0, away: 0 });
            }
        } else {
            // Date range selected
            const membersInRange = filteredData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            }).flatMap(item =>
                item.departments.flatMap(dept =>
                    dept.teams.flatMap(team => team.members)
                )
            );

            let inOfficeCount = 0;
            let wfhCount = 0;

            membersInRange.forEach(member => {
                if (member.WFH_Type === 'IN') {
                    inOfficeCount++;
                } else {
                    wfhCount++;
                }
            });

            const totalMembers = membersInRange.length;
            const inOfficePercentage = (inOfficeCount / totalMembers) * 100 || 0;
            const wfhPercentage = (wfhCount / totalMembers) * 100 || 0;

            setStats({
                inOffice: inOfficePercentage,
                wfh: wfhPercentage,
                away: 0
            });
        }
    }, [startDate, endDate, currentMonth, fetchParams]);

    const total = stats.inOffice + stats.wfh + stats.away;

    return (
        <>
            <div className="w-[100%] h-[100%] flex gap-10 flex-row p-2">
                <div className="w-[20%] h-[100%] flex flex-col flex-start justify-center pl-2 gap-2">
                    <span className="w-full text-[30px] font-bold">{format(currentMonth, 'MMM yy')} </span>
                    <div className="w-[60%] h-[30%] flex gap-2 justify-center align-center">
                        <button onClick={() => handleMonthChange(-1)} className="bg-black text-white w-[50%] h-full rounded-md text-[25px] p-0 m-0"> {'<'} </button>
                        <button onClick={() => handleMonthChange(1)} className="bg-black text-white w-[50%] h-full rounded-md text-[25px] p-0 m-0"> {'>'} </button>
                    </div>
                </div>
                <div className="w-[50%] h-[100%] text-left flex flex-col justify-center items-center font-bold">
                    <div className="mb-2  w-full">🏢 In Office </div>
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
                        {/* {stats.away > 0 && (
                        <div
                            className="h-full bg-red flex justify-center align-center transition-all duration-300 ease-in-out" // Add transition class here
                            style={{ width: `${(stats.away / total) * 100}%` }}
                        >
                            <span className="text-white ml-2 text-xs">{stats.away.toFixed(0)}%</span>
                        </div>
                    )} */}
                    </div>
                    <div className="mt-2 flex flex-start gap-3 w-full">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green mr-1 "></div>
                            <span>IN</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange mr-1"></div>
                            <span>WFH</span>
                        </div>
                        {/* <div className="flex items-center">
                        <div className="w-3 h-3 bg-red mr-1"></div>
                        <span>Away</span>
                    </div> */}
                    </div>
                </div>
                <div className="w-[25%] h-[100%] flex flex-col justify-center items-center overflow-hidden">
                    <Button text="Apply WFH" onClick={() => setShowModal(true)} />
                    <div className="mt-3 border border-gray-300 rounded-[10px] p-3 font-bold ">
                        {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div onClick={() => setShowModal(false)} className="overlay"></div>
                    <div className="modal-content flex flex-col justify-center">
                        <div className="text-center">
                            <span className="w-full text-[30px] font-bold">Apply for WFH</span>
                        </div>
                        <br />
                        <br />
                        <form onSubmit={sendRequest}>
                            <div className="flex">

                                <div className="flex flex-col" style={{ marginInline: '15px' }}>
                                    <div className="h-[10px]"></div>
                                    <span className="text-[20px] font-bold">Date Range</span>
                                    <br />
                                    <br />
                                    <span className="text-[20px] font-bold">Days of the Week</span> 
                                    <br/>
                                    <br/>
                                    <br/>
                                    <span className="text-[20px] font-bold">WFH Type</span>
                                    <br />
                                    <br />
                                    <br />
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
                                    <Button color="" onClick={(e) => handleCalenButton(e)} text={modalDateRange}></Button>

                                    <div className="col-span-9 row-span-9 shadow-md">
                                        {showCalen && <Calendar style={{ zIndex: '100001', position: 'absolute', top: '100%', left: '0' }}
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

                                    <br />
                                    <br />
                                    <select className="rounded-[10px] h-[50px] font-bold border-2" style={{ padding: '10px' }} value={WFHType} onChange={(e) => setWFHType(e.target.value)}>
                                        <option selected></option>
                                        <option>Full Day (FD)</option>
                                        <option>Morning only (AM)</option>
                                        <option>Afternoon only (PM)</option>
                                    </select>
                                    <br />
                                    <br />
                                    <textarea className="w-[250px] h-[150px] rounded-[10px]" style={{ padding: '10px' }} value={WFHReason} onChange={(e) => setWFHReason(e.target.value)}></textarea>

                                    <br/>
                                    <br/>
                                    <input type='file' multiple></input>

                                </div>
                            </div>

                            <br />
                            <br />


                            <div className="center-div">
                                <Button text="Send Request" color="bg-green text-white" onClick={() => sendRequest()} />
                                <br />
                                <br />
                                <Button text="x Close" color="bg-tag-grey-dark text-white" onClick={() => setShowModal(false)} />
                            </div>
                            <br />
                        </form>
                    </div>
                </div>
            )}

        </>
    );
}

export default TopFilterPanel;