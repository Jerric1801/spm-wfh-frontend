import { useEffect, useState } from 'react';

function WeekdayButton({ weekday, width = "14%", height = "50px", setrecurringDays, disabled }) {
    const activeColor = "bg-green text-white";
    const inactiveColor = "bg-white text-black";
    const [btnColor, setBtnColor] = useState(inactiveColor);

    useEffect(() => {
        if (disabled) {
            setBtnColor(inactiveColor);
        }
    }, [disabled]);

    const updateRecurringDays = (event, weekday) => {
        event.preventDefault();
        if (!disabled) { // Only update if not disabled
            setrecurringDays(recurringDays => ({ ...recurringDays, [weekday]: !recurringDays[weekday] }));
            setBtnColor(btnColor == inactiveColor ? activeColor : inactiveColor);
        }
    }

    return (
        <button
            className={`rounded-[10px] font-bold border-2 border-gray-300 ${btnColor} 
                       ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
            style={{ width: width, height: height }}
            onClick={(event) => updateRecurringDays(event, weekday)}
            disabled={disabled}
        >
            {weekday}
        </button>
    );
}

export default WeekdayButton;