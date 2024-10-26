import { useState } from 'react';

function WeekdayButton({weekday, width = "14%", height = "50px",setrecurringDays}){ //
    const [btnColor, setBtnColor] = useState("bg-white"); //bg-green
    
    
    const updaterecurringDays = (event,weekday) =>{   
        event.preventDefault(); 
        setrecurringDays(recurringDays => ({...recurringDays, [weekday]: !recurringDays[weekday]}));
        // set button color
        console.log(weekday);
        setBtnColor(btnColor == "bg-white" ? "bg-green":"bg-white");
    }
    
    return (
        <button
            className={`rounded-[10px] font-bold border-2  text-black border-grey ${btnColor}`}
            style={{ width: width, height: height, backgroundColor: btnColor }}
            onClick={(event)=>updaterecurringDays(event,weekday)}
        >
            {weekday}
        </button>
    );
}

export default WeekdayButton;