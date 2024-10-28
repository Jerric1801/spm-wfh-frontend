import Tag from '../common/Tag';
import { useState, useEffect, useContext } from 'react';
import { isSameDay } from 'date-fns';
import { ScheduleContext } from '../../context/ScheduleContext';

function Day({ day, tags, requests, onSelect, selectedDateRange, onMouseOver }) {
    const isToday = day.isToday;

    const { fetchParams } = useContext(ScheduleContext);
    const [memberCount, setMemberCount] = useState({ IN: 0, WFH: 0 });

    const isWithinRange = selectedDateRange &&
        day.date >= selectedDateRange.start &&
        day.date <= selectedDateRange.end;

    useEffect(() => {
        const matchingData = fetchParams.filteredData.find(item => isSameDay(new Date(item.date), day.date));

        if (matchingData) {
            let amCount = 0;
            let pmCount = 0;
            let wdCount = 0;
            let inCount = 0;


            if (fetchParams.department && fetchParams.team) {
                const members = matchingData.departments
                    .find(d => d.department === fetchParams.department)?.teams
                    .find(t => t.team === fetchParams.team)?.members;

                if (members) {
                    members.forEach(member => {
                        switch (member.WFH_Type) {
                            case 'AM': amCount++; break;
                            case 'PM': pmCount++; break;
                            case 'WD': wdCount++; break;
                            case 'IN': inCount++; break;
                        }
                    });
                }
            } else if (fetchParams.department) {
                const department = matchingData.departments.find(d => d.department === fetchParams.department);
                if (department) {
                    department.teams.forEach(team => {
                        team.members.forEach(member => {
                            switch (member.WFH_Type) {
                                case 'AM': amCount++; break;
                                case 'PM': pmCount++; break;
                                case 'WD': wdCount++; break;
                                case 'IN': inCount++; break;
                            }
                        });
                    });
                }
            } else {
                matchingData.departments.forEach(dept => {
                    dept.teams.forEach(team => {
                        team.members.forEach(member => {
                            switch (member.WFH_Type) {
                                case 'AM': amCount++; break;
                                case 'PM': pmCount++; break;
                                case 'WD': wdCount++; break;
                                case 'IN': inCount++; break;
                            }
                        });
                    });
                });
            }

            setMemberCount({ IN: inCount, WFH: amCount + pmCount + wdCount });
        } else {
            setMemberCount({ IN: 0, WFH: 0 });
        }
    }, [day.date, fetchParams]);


    // const tagData = [
    //     { text: "WFH Confirmed", color: "green" },
    //     { text: "WFH Pending", color: "orange" },
    //     { text: "WFH Rejected", color: "red" },
    //     { text: "Public Holiday", color: "grey" },
    // ];

    // const filteredTags = tags ? tagData.filter(tag => tags.includes(tag.text)) : [];

    const handleClick = () => {
        onSelect(day.date);
    };

    // let wfhPercentageColor = 'red';
    // if (day.wfhPercentage?.in >= 60) {
    //     wfhPercentageColor = 'green';
    // } else if (day.wfhPercentage?.in >= 30) {
    //     wfhPercentageColor = 'orange';
    // }

    return (
        <div
            className={`p-2 border border-gray-200 text-left relative 
                  ${isWithinRange ? 'bg-light-green' : ''}`}
            onClick={handleClick}
            onMouseOver={onMouseOver}>
            <div className={`w-7 flex justify-center align-center rounded-[99px] ${isToday ? 'bg-green' : ''}  ${isToday ? 'text-white' : 'text-gray-500'}`}>{day.number}</div>
            <div className="absolute bottom-2 left-2">
            {requests.map((request, index) => {
                    let color = "gray"; // Default color 
                    switch (request.Current_Status) {
                        case "Confirmed": color = "green"; break;
                        case "Pending": color = "orange"; break;
                        case "Rejected": color = "red"; break;
                    }

                    return (
                        <Tag
                            key={index}
                            text={`${request.WFH_Type} ${request.Current_Status}`}
                            color={color} 
                        />
                    );
                })}
            </div>
            <div className="absolute top-2 right-2 grid grid-cols-2 gap-1">

                {Object.entries(memberCount).map(([type, count]) => (

                    <Tag
                        key={type}
                        text={`${count}`}
                        color={type === 'IN' ? 'green' : 'orange'} // Conditional color 
                        reverse={true}
                    />
                ))}
            </div>
        </div>
    );
}

export default Day;