import Button from '../common/Button';
import "../../assets/styles/applyWFHModal.css";
import { useState, useEffect, useContext } from 'react';
import { isSameDay, isBefore, setMinutes, setHours, format, startOfMonth, addDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';
//import calendarData from '../../data/dashboard/calendar.json'
import { ScheduleContext } from '../../context/ScheduleContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import WeekdayButton from '../applyWFH/WeekdayButton';
import { applyWFH } from '../../services/endpoints/applyWFH'
import { useLocation } from 'react-router-dom';
//import FileUploadMultiple from '../applyWFH/UploadFiles';
//import FileBase64 from 'react-file-base64';

function TopFilterPanel({ setSelectedDateRange, currentMonth, startDate = new Date(), endDate = new Date() }) {
    const { setCurrentMonth, fetchParams } = useContext(ScheduleContext);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [showCalen, setShowCalen] = useState(false);
    const [modalDateRange, setModalDateRange] = useState(`${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
    const [recurringDays, setrecurringDays] = useState({
        'M': false,
        'Tu': false,
        'W': false,
        'Th': false,
        'F': false,
        'Sa': false,
        'Su': false,
    })
    const dayNum = {
        'M': 1,
        'Tu': 2,
        'W': 3,
        'Th': 4,
        'F': 5,
        'Sa': 6,
        'Su': 0,
    }
    const numToDay = {
        1: 'M',
        2: 'Tu',
        3: 'W',
        4: 'Th',
        5: 'F',
        6: 'Sa',
        0: 'Su',
    }


    const [WFHRange, setWFHRange] = useState([startOfDay(new Date()), endOfDay(new Date())]);
    const [WFHType, setWFHType] = useState('');
    const [WFHReason, setWFHReason] = useState('');
    const [fileList, setFileList] = useState([]); // file list
    const [base64Files, setBase64Files] = useState([]);

    const sendRequest = async (event) => {
        event.preventDefault();
        let error = 0;
        const today = new Date();

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

        //console.log(WFHRange);

        let recurDayNums = [];

        for (var day in recurringDays) {
            if (recurringDays[day] == true) {
                recurDayNums.push(dayNum[day]);
            }
        }
        if (recurDayNums.length == 0) {
            alert('Please select at least one day in a week.');
            error += 1;
        }

        let dateArray = [];

        // Set currentDate to the start of WFHRange or to "today" if WFHRange is missing
        let currentDate = WFHRange[0]
            ? new Date(Date.UTC(WFHRange[0].getUTCFullYear(), WFHRange[0].getUTCMonth(), WFHRange[0].getUTCDate()))
            : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
        
        // Set endDate to either the second date in WFHRange or default to currentDate if WFHRange has only one date
        const endDate = WFHRange[1]
            ? new Date(Date.UTC(WFHRange[1].getUTCFullYear(), WFHRange[1].getUTCMonth(), WFHRange[1].getUTCDate(), 23, 59, 59))
            : new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59));
        
        while (isBefore(currentDate, addDays(endDate, 1))) { // Loop includes the end date till 23:59 UTC
            if (recurDayNums.includes(currentDate.getUTCDay())) { // Use getUTCDay for day calculation in UTC
                dateArray.push(new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())));
            }
            currentDate = addDays(currentDate, 1); // Move to the next day in UTC
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
                const wfhTypeAbbreviation = {
                    'Full Day (FD)': 'WD',
                    'Morning only (AM)': 'AM',
                    'Afternoon only (PM)': 'PM',
                }[WFHType];
                console.log(dateArray)
                const payload = {
                    Dates: dateArray,
                    WFHType: wfhTypeAbbreviation,
                    WFHReason: WFHReason,
                    Document: base64Files,
                }

                const res = await applyWFH(payload)

                // TODO integration w endpoint

                if (res.success) {
                    alert('WFH request successfully submitted!');
                    window.location = "/personal"
                } else {
                    alert(res.data.error);
                }

            }

        }
    };

    useEffect(() => {
        setModalDateRange(`${WFHRange[0].toLocaleDateString()} to ${WFHRange[1].toLocaleDateString()}`);
        if (differenceInDays(WFHRange[0], WFHRange[1]) < 7) {
            console.log('disabling some day buttons...');
            // check which days to disable
            let disableVar = {
                'M': true,
                'Tu': true,
                'W': true,
                'Th': true,
                'F': true,
                'Sa': true,
                'Su': true,
            };
            let currentDate = WFHRange[0];
            while (isBefore(currentDate, WFHRange[1])) { // small bug: when user doesnt select date range (auto today, isbefore doesnt work)
                disableVar[numToDay[currentDate.getDay()]] = false;
                currentDate = addDays(currentDate, 1);
            }
            console.log(disableVar)
            setButtonDisabled(disableVar);

        }
    }, [WFHRange]);



    const [buttonDisabled, setButtonDisabled] = useState({
        'M': false,
        'Tu': false,
        'W': false,
        'Th': false,
        'F': false,
        'Sa': false,
        'Su': false,
    });

    const handleFileChange = (e) => { // one step late
        const files = Array.from(e.target.files);
        setFileList(files);

        const fileReaders = [];
        const base64Array = [];

        files.forEach((file, index) => {
            const reader = new FileReader();
            fileReaders.push(reader);
            reader.onload = (event) => {
                base64Array.push(event.target.result);

                // Check if all files are processed
                if (base64Array.length === files.length) {
                    setBase64Files(base64Array);
                }
            };

            reader.readAsDataURL(file);
        });
    }
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('showModal') === 'true') {
            setShowModal(true);
        }
    }, [location]);

    useEffect(() => {
        console.log(base64Files);
    }, [base64Files]);

    useEffect(() => {
        console.log(fileList);
    }, [fileList]);




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
                    <Button text="Apply WFH" isSelected={true} onClick={() => setShowModal(true)} />
                    <div className="mt-3 border border-gray-300 rounded-[10px] p-3 font-bold ">
                        {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal fixed inset-0 z-50 flex">
                    <div onClick={() => setShowModal(false)} className="overlay absolute inset-0 bg-black opacity-50"></div>
                    <div className="modal-content bg-white p-8 w-[40vw] md:w-[40vw] lg:w-[32vw] relative overflow-auto ">
                        <div className="text-center mb-6">
                            <span className="w-full text-3xl font-bold">Apply for WFH</span>
                        </div>

                        <form className="flex flex-col">
                            {/* Removed md:flex-row */}

                            <div className="mb-4">
                                <span className="text-xl font-bold">Date Range</span>
                                <div className="mt-2 relative"> {/* Added spacing and relative positioning */}
                                    <Button
                                        color=""
                                        onClick={(e) => handleCalenButton(e)}
                                        text={modalDateRange}
                                    />
                                    {showCalen && (
                                        <Calendar
                                            style={{ zIndex: '100001', position: 'absolute', top: '100%', left: '0' }}
                                            selectRange={true}
                                            onChange={setWFHRange}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-xl font-bold">Days of the Week</span>
                                <div className="mt-2 flex"> {/* Added spacing */}
                                    {['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'].map((day) => (
                                        <WeekdayButton
                                            key={day}
                                            weekday={day}
                                            setrecurringDays={setrecurringDays}
                                            disabled={buttonDisabled[day]}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-xl font-bold">WFH Type</span>
                                <div className="mt-2"> {/* Added spacing */}
                                    <select
                                        className="rounded-md h-12 font-bold border-2 px-4 py-2 w-full"
                                        value={WFHType}
                                        onChange={(e) => setWFHType(e.target.value)}
                                    >
                                        <option selected></option>
                                        <option>Full Day (FD)</option>
                                        <option>Morning only (AM)</option>
                                        <option>Afternoon only (PM)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="text-xl font-bold">Reason</span>
                                <div className="mt-2"> {/* Added spacing */}
                                    <textarea
                                        className="w-full h-40 rounded-md border-2 p-2"
                                        value={WFHReason}
                                        onChange={(e) => setWFHReason(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <div>
                                <span className="text-xl font-bold">Attach Files</span>
                                <div className="mt-2"> {/* Added spacing */}
                                    <input type='file' multiple onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Button
                                    text="Send Request"
                                    color="bg-green text-white"
                                    onClick={(event) => sendRequest(event)}
                                    className="mr-4"
                                />
                                <Button
                                    text="x Close"
                                    color="bg-tag-grey-dark text-white"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
}

export default TopFilterPanel;