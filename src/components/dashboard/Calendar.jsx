import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import Day from './Day'
import calendarData from '../../data/dashboard/calendar.json'

function Calendar() {
    //temp data for Calendar 
    const tempData = calendarData
    const currentMonth = new Date(2024, 8);

    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const daysInMonth = eachDayOfInterval({ start, end });
    
    const days = daysInMonth.map((date) => {
        const matchingData = calendarData.find(item => 
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

    function handleDaySelect(selectedDate) {
        // Handle the selected date here (e.g., update state)
        console.log('Selected date:', selectedDate);
    }

    return (
        <div className="w-[100%] h-[100%] p-1 rounded-lg flex flex-col flex-grow overflow-auto">
            <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-left text-gray-500 font-medium border border-gray-200 p-2">{day}</div>
                ))}
            </div>

            {/* Grid for days */}
            <div className="grid grid-cols-7 gap-0 flex-grow ">
                {days.map((day) => (
                    <Day key={day.date} day={day} tags={day.tags} onSelect={handleDaySelect}></Day>
                ))}
            </div>
        </div>
    )
}

export default Calendar