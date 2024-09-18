import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import Day from './Day'

function Calendar() {
    const currentMonth = new Date(2024, 8); // September is 0-indexed, so it's 8

    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end }).map((date) => ({
      date,
      number: format(date, 'd'),
      isToday: isSameDay(date, new Date()),
    }));
  
    return (
        <div className="w-[100%] h-[100%] p-1 calendar-container rounded-lg flex flex-col flex-grow overflow-auto">
            <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-left text-gray-500 font-medium border border-gray-200 p-2">{day}</div>
                ))}
            </div>

            {/* Grid for days */}
            <div className="calendar-grid grid grid-cols-7 gap-0 flex-grow ">
                {days.map((day) => (
                    <Day key={day.date} day={day} />
                ))}
            </div>
        </div>
    )
}

export default Calendar