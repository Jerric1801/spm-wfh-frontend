import Tag from '../common/Tag';
import { useState, useEffect, useContext } from 'react';
import { isSameDay } from 'date-fns';
import { ScheduleContext } from '../../context/ScheduleContext';

function Day({ day, tags, onSelect, selectedDateRange, onMouseOver }) {
    const isToday = day.isToday;

    const { scheduleData, fetchParams } = useContext(ScheduleContext);
    const [memberCount, setMemberCount] = useState(0);

    useEffect(() => {
        const matchingData = scheduleData.find(item => isSameDay(new Date(item.date), day.date));

        if (matchingData) {
            if (fetchParams.department && fetchParams.team) { // Department and team selected
                const members = matchingData.departments
                    .find(d => d.department === fetchParams.department)?.teams
                    .find(t => t.team === fetchParams.team)?.members;

                setMemberCount(members ? members.length : 0);
            } else if (fetchParams.department) { // Only department selected
                let totalCount = 0;
                const department = matchingData.departments.find(d => d.department === fetchParams.department);
                if (department) {
                    department.teams.forEach(team => {
                        totalCount += team.members.length; // Count all members in the department
                    });
                }
                
                setMemberCount(totalCount);
            }
            else { // No department or team selected
                let totalCount = 0;
                matchingData.departments.forEach(dept => {
                    dept.teams.forEach(team => {
                        totalCount += team.members.length; // Count all members
                    });
                });
                setMemberCount(totalCount);
            }
        } else {
            setMemberCount(0);
        }
    }, [day.date, scheduleData, fetchParams]);


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
                <Tag key="memberCount" text={memberCount} color="blue" reverse={true} />
            </div>
        </div>
    );
}

export default Day;