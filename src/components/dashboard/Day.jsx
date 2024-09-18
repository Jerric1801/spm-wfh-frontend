function Day({ day }) {
    const isToday = day.isToday;

    return (
        <div className={`calendar-day p-5 border border-gray-200 text-left ${isToday ? 'bg-blue-200' : ''}`}>
            <div className="day-number text-gray-500">{day.number}</div>
        </div>
    );
}

export default Day;