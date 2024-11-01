import { useEffect, useState } from 'react';

function WeekdayButton({weekday, width = "14%", height = "50px",setrecurringDays,disabled}){ //
    const activeColor = "bg-green text-white";
    const inactiveColor = "bg-white text-black";
    const [btnColor, setBtnColor] = useState(inactiveColor); //bg-green
    
    useEffect(() => {
        if(disabled){
            setBtnColor(inactiveColor);
        }
    }, [disabled]);
    
    const updateRecurringDays = (event,weekday) =>{   
        event.preventDefault(); 
        setrecurringDays(recurringDays => ({...recurringDays, [weekday]: !recurringDays[weekday]}));
        // set button color
        console.log(weekday);
        
        //flip colour
        setBtnColor(btnColor == inactiveColor ? activeColor:inactiveColor);
        
    }

    return (
        <button
            className={`rounded-[10px] font-bold border-2  border-grey ${btnColor}`}
            style={{ width: width, height: height, backgroundColor: btnColor}}
            onClick={(event)=>updateRecurringDays(event,weekday)}
            disabled={disabled}
        >
            {weekday}
        </button>
    );
}

export default WeekdayButton;