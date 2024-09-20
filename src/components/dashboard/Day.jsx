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

    return (
        <div className={`p-3 border border-gray-200 text-left relative ${isToday ? 'bg-green' : ''}`} onClick={handleClick}>
            <div className={`${isToday ? 'text-white' : 'text-gray-500'}`}>{day.number}</div>
            <div className="flex flex-col h-auto w-[100%]">

            </div>
            <div className="absolute bottom-2 left-2">
                {filteredTags.map((tag, index) => (
                    <Tag key={index} text={tag.text} color={tag.color} />
                ))}
            </div>
            <div className="absolute top-2 right-2">
                {filteredTags.map((tag, index) => (
                    <Tag  key={index} text="20%" />
                ))}
            </div>
        </div>
    );
}

export default Day;