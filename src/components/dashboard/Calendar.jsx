import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, getDay } from 'date-fns';
import Day from './Day'
import calendarData from '../../data/dashboard/calendar.json'

function Calendar({ selectedDateRange, setSelectedDateRange, isDragging, setIsDragging, currentMonth }) {
    //temp data for Calendar 
    const tempData = calendarData
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const daysInMonth = eachDayOfInterval({ start, end });

    const days = daysInMonth.map((date) => {
        const matchingData = tempData.find(item =>
            isSameDay(new Date(item.date), date)
        );

        return {
            date,
            number: format(date, 'd'),
            isToday: isSameDay(date, new Date()),
            tags: matchingData ? [matchingData.wfhStatus] : [],
            teamWfhPercentage: matchingData ? matchingData.teamWfhPercentage : null,
        };
    });

    const firstDayOfMonth = startOfMonth(currentMonth);
    const firstDayOfCalendarGrid = startOfWeek(firstDayOfMonth); // Get the first day of the week the month starts in

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

    // Handles the mouse down event on the calendar. It initiates the dragging 
    // date based on the mouse position
    function handleMouseDown(event) {
        setIsDragging(true);

        const calendarGrid = event.currentTarget;
        const rect = calendarGrid.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const col = Math.floor(x / (rect.width / 7));
        const row = Math.floor((y - (blankDays.length / 7) * (rect.height / (allDays.length / 7))) / 
                               (rect.height / (allDays.length / 7)));
    
        const clickedDateIndex = row * 7 + col;
        const clickedDate = allDays[clickedDateIndex]?.date;
    
        if (selectedDateRange &&
            clickedDate >= selectedDateRange.start &&
            clickedDate <= selectedDateRange.end) {
            // Click is within existing selection, don't start dragging
            setIsDragging(false);
            return;
        }

        setSelectedDateRange({ start: clickedDate, end: null });
    }

    // Handles the mouse up event, typically marking the end of a drag 
    // selection.
    function handleMouseUp(event) {
        setIsDragging(false);

        if (!selectedDateRange?.start) return;
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
            end: endDate || selectedDateRange.start
        });
    }

    // Handles the mouse over event on calendar days. 
    function handleMouseOver(date) {
        if (isDragging && selectedDateRange?.start) {
            setSelectedDateRange({ ...selectedDateRange, end: date });
        }
    }
    return (
        <div id="calendarGrid" className="w-[100%] h-[100%] p-1 rounded-lg flex flex-col flex-grow overflow-auto select-none" onMouseDown={handleMouseDown}
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
                        <Day key={day.date}
                            day={day}
                            tags={day.tags}
                            onSelect={handleDaySelect}
                            selectedDateRange={selectedDateRange}
                            onMouseOver={() => handleMouseOver(day.date)}
                        ></Day>
                    )
                ))}
            </div>
        </div>
    )
}

export default Calendar