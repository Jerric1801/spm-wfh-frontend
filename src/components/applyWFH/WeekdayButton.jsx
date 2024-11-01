import { useState } from 'react';

function WeekdayButton({weekday, width = "14%", height = "50px",setrecurringDays}){ //
    const activeColor = "bg-green text-white";
    const inactiveColor = "bg-white text-black";
    const [btnColor, setBtnColor] = useState(inactiveColor); //bg-green
    
    
    const updaterecurringDays = (event,weekday) =>{   
        event.preventDefault(); 
        setrecurringDays(recurringDays => ({...recurringDays, [weekday]: !recurringDays[weekday]}));
        // set button color
        console.log(weekday);
        setBtnColor(btnColor == inactiveColor ? activeColor:inactiveColor);
    }
    
    return (
        <button
            className={`rounded-[10px] font-bold border-2  border-grey ${btnColor}`}
            style={{ width: width, height: height, backgroundColor: btnColor }}
            onClick={(event)=>updaterecurringDays(event,weekday)}
        >
            {weekday}
        </button>
    );
}

export default WeekdayButton;