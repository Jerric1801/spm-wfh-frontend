import { useState, useEffect, useContext } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, getDay } from 'date-fns';
import Day from './Day'
import { ScheduleContext } from '../../context/ScheduleContext';

function Calendar({ selectedDateRange, setSelectedDateRange, isDragging, setIsDragging, currentMonth }) {
    const { fetchParams, staffRequests } = useContext(ScheduleContext);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });
    const [dragStarted, setDragStarted] = useState(false);
    const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });

    const days = daysInMonth.map((date) => {
        const matchingData = fetchParams.filteredData.find(item => isSameDay(new Date(item.date), date));

        const requestsForDay = staffRequests
            ? staffRequests.flatMap(request => {
                const requestStartDate = new Date(request.Start_Date);
                const requestEndDate = new Date(request.End_Date);

                // Check if there are recurring dates
                if (request.Recurring_Dates && request.Recurring_Dates.length > 0) {
                    // If recurring, filter dates within the range and matching recurring days
                    const recurringDaysOfWeek = request.Recurring_Dates.map(day => {
                        switch (day) {
                            case 'Mon': return 1;
                            case 'Tue': return 2;
                            case 'Wed': return 3;
                            case 'Thu': return 4;
                            case 'Fri': return 5;
                            case 'Sat': return 6;
                            case 'Sun':
                                return 0;
                            default: return -1;
                            // Invalid day
                        }
                    });
                    return eachDayOfInterval({ start: requestStartDate, end: requestEndDate })
                        .filter(d => recurringDaysOfWeek.includes(getDay(d)) && isSameDay(d, date))
                        .map(d => ({ ...request, Start_Date: d, End_Date: d }));
                } else {
                    // If not recurring, check if the date is within the range
                    const isWithinRange = date >= requestStartDate && date <= requestEndDate;
                    return isWithinRange ? [request] : [];
                }
            })
            : [];

        const tags = matchingData?.departments.flatMap(department =>
            department.teams.flatMap(team =>
                team.members.map(member => member.WFH_Type)
            )
        ) || [];

        return {
            date,
            number: format(date, 'd'),
            isToday: isSameDay(date, new Date()),
            tags: tags,
            requests: requestsForDay
        };
    });


    const firstDayOfMonth = startOfMonth(currentMonth);
    const firstDayOfCalendarGrid = startOfWeek(firstDayOfMonth);

    // Calculate the number of blank days at the start
    const blankDays = eachDayOfInterval({
        start: firstDayOfCalendarGrid,
        end: firstDayOfMonth
    }).slice(0, -1);

    // Combine blank days and days of the month
    const allDays = [
        ...blankDays.map(date => ({ date, isBlank: true })),
        ...days
    ];

    useEffect(() => {
        // Attach mouseup event listener to the window
        window.addEventListener('mouseup', handleMouseUp);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Handles the selection of a single day when the user clicks on it.
    function handleDaySelect(selectedDate) {
        if (!isDragging) {
            setSelectedDateRange({ start: selectedDate, end: selectedDate });
        }
    }
    function handleMouseOver(day) {

    }

    // Handles the mouse down event on the calendar. It initiates the dragging 
    // date based on the mouse position
    function handleMouseDown(event) {
        setIsDragging(true);
        setDragStarted(false); // Reset dragStarted

        const calendarGrid = event.currentTarget;
        const rect = calendarGrid.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / (rect.width / 7));
        const row = Math.floor((y - (blankDays.length / 7) * (rect.height / (allDays.length / 7))) /
            (rect.height / (allDays.length / 7)));

        const clickedDateIndex = row * 7 + col;
        const clickedDate = allDays[clickedDateIndex]?.date;

        // Store initial mouse position
        setInitialMousePosition({ x: event.clientX, y: event.clientY });

        if (selectedDateRange &&
            clickedDate >= selectedDateRange.start &&
            clickedDate <= selectedDateRange.end) {
            // Click is within existing selection, don't start dragging
            setIsDragging(false);
            return;
        }

        setSelectedDateRange({ start: clickedDate, end: clickedDate });
    }

    // Handles the mouse up event, typically marking the end of a drag 
    // selection.
    function handleMouseUp(event) {
        setIsDragging(false);

        if (dragStarted) { // Only update if a drag occurred
            const calendarGrid = document.getElementById('calendarGrid');
            let targetElement = event.target;
            while (targetElement && targetElement !== calendarGrid) {
                targetElement = targetElement.parentNode;
            }
            if (!targetElement) {
                setSelectedDateRange(null);
                return;
            }
            const rect = calendarGrid.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / (rect.width / 7));
            const row = Math.floor((y - (blankDays.length / 7) * (rect.height / (allDays.length / 7))) /
                (rect.height / (allDays.length / 7)));

            const endDateIndex = row * 7 + col;
            const endDate = allDays[endDateIndex]?.date;

            setSelectedDateRange({
                start: selectedDateRange.start,
                end: endDate
            });
        }
    }

    // Handles the mouse over event on calendar days. 
    function handleMouseMove(event) {
        if (!isDragging) return;

        const dragThreshold = 5; // Adjust as needed
        const { x, y } = initialMousePosition;
        const distance = Math.sqrt(
            Math.pow(event.clientX - x, 2) + Math.pow(event.clientY - y, 2)
        );

        if (distance > dragThreshold) {
            setDragStarted(true);
        }

        if (dragStarted && selectedDateRange?.start) {
            const calendarGrid = document.getElementById('calendarGrid');
            const rect = calendarGrid.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const col = Math.floor(x / (rect.width / 7));
            const row = Math.floor((y - (blankDays.length / 7) * (rect.height / (allDays.length / 7))) /
                (rect.height / (allDays.length / 7)));

            const endDateIndex = row * 7 + col;
            const endDate = allDays[endDateIndex]?.date;

            setSelectedDateRange({ ...selectedDateRange, end: endDate });
        }

    }
    return (
        <div
            id="calendarGrid"
            className="w-[100%] h-[100%] p-1 rounded-lg flex flex-col flex-grow overflow-auto select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove} // Add mousemove listener
        >
            <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-left text-gray-500 font-medium border border-gray-200 p-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0 flex-grow ">
                {allDays.map((day) => (
                    day.isBlank ? (
                        <div key={day.date} className="p-2 border border-gray-200"></div>
                    ) : (
                        <Day
                            key={day.date}
                            day={day}
                            tags={day.tags}
                            onSelect={handleDaySelect}
                            requests={day.requests}
                            selectedDateRange={selectedDateRange}
                            onMouseOver={() => handleMouseOver(day.date)}
                        />
                    )
                ))}
            </div>
        </div>
    )
}

export default Calendar;