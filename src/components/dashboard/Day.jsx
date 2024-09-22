import Tag from '../common/Tag';
import {useState} from 'react';

function Day({ day, tags, onSelect, selectedDateRange }) {
    const isToday = day.isToday;
    const [isSelected, setIsSelected] = useState(false);

    const tagData = [
        { text: "WFH Confirmed", color: "green" },
        { text: "WFH Pending", color: "orange" },
        { text: "WFH Rejected", color: "red" },
        { text: "Public Holiday", color: "grey" },
    ];

    const filteredTags = tags ? tagData.filter(tag => tags.includes(tag.text)) : [];

    const handleClick = () => {
        if (selectedDateRange) {
            const isWithinRange = day.date >= selectedDateRange.start && day.date <= selectedDateRange.end;
            if (isWithinRange) {
                setIsSelected(!isSelected);
                onSelect(day.date); 
            }
        } else {
            setIsSelected(!isSelected);
            onSelect(day.date); 
        }

    };

    let wfhPercentageColor = 'red'; 
    if (day.teamWfhPercentage >= 60) {
        wfhPercentageColor = 'green';
    } else if (day.teamWfhPercentage >= 30) {
        wfhPercentageColor = 'orange';
    } else if (day.teamWfhPercentage > 0) {
        wfhPercentageColor = 'red';
    }

    return (
        <div className={`p-2 border border-gray-200 text-left relative ${isSelected ? 'bg-light-green' : ''}`} onClick={handleClick}>
            <div className= {`w-7 flex justify-center align-center rounded-[99px] ${isToday ? 'bg-green' : ''}  ${isToday ? 'text-white' : 'text-gray-500'}`}>{day.number}</div>
            <div className="absolute bottom-2 left-2">
                {filteredTags.map((tag, index) => (
                    <Tag key={index} text={tag.text} color={tag.color} />
                ))}
            </div>
            <div className="absolute top-2 right-2">
                {day.teamWfhPercentage !== null && (
                    <Tag key="wfhPercentage" text={`${day.teamWfhPercentage}%`} color={wfhPercentageColor} reverse={true} />
                )}
            </div>
        </div>
    );
}

export default Day;