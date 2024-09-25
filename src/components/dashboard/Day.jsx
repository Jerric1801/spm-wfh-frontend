import Tag from '../common/Tag';
import { useState, useEffect } from 'react';


function Day({ day, tags, onSelect, selectedDateRange, onMouseOver }) {
    const isToday = day.isToday;

    useEffect(() => {
        // This will cause the component to re-render whenever selectedDateRange changes
    }, [selectedDateRange]);

    const isWithinRange = selectedDateRange &&
        day.date >= selectedDateRange.start &&
        day.date <= selectedDateRange.end;

    const [isSelected, setIsSelected] = useState(false);

    const tagData = [
        { text: "WFH Confirmed", color: "green" },
        { text: "WFH Pending", color: "orange" },
        { text: "WFH Rejected", color: "red" },
        { text: "Public Holiday", color: "grey" },
    ];

    const filteredTags = tags ? tagData.filter(tag => tags.includes(tag.text)) : [];

    const handleClick = () => {
        onSelect(day.date);
    };

    let wfhPercentageColor = 'red'; 
    if (day.wfhPercentage?.in >= 60) {
        wfhPercentageColor = 'green';
    } else if (day.wfhPercentage?.in >= 30) {
        wfhPercentageColor = 'orange';
    } 

    return (
        <div
            className={`p-2 border border-gray-200 text-left relative 
                  ${isSelected ? 'bg-light-green' : ''} 
                  ${isWithinRange ? 'bg-light-green' : ''}`}
            onClick={handleClick}
            onMouseOver={onMouseOver}>
            <div className={`w-7 flex justify-center align-center rounded-[99px] ${isToday ? 'bg-green' : ''}  ${isToday ? 'text-white' : 'text-gray-500'}`}>{day.number}</div>
            <div className="absolute bottom-2 left-2">
                {filteredTags.map((tag, index) => (
                    <Tag key={index} text={tag.text} color={tag.color} />
                ))}
            </div>
            <div className="absolute top-2 right-2">
                {day.wfhPercentage && ( 
                    <Tag key="wfhPercentage" text={`${day.wfhPercentage.in}%`} color={wfhPercentageColor} reverse={true} />
                )}
            </div>
        </div>
    );
}

export default Day;