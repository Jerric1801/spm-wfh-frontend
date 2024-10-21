import React, { useState, useContext, useEffect, useMemo } from 'react';
import Button from '../common/Button';
import { startOfMonth, endOfMonth } from 'date-fns';
import Tag from '../common/Tag';
import { ScheduleContext } from '../../context/ScheduleContext';

function LeftFilterPanel({ selectedDateRange }) {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const { scheduleData, setFetchParams, currentMonth } = useContext(ScheduleContext);

    const departmentEmojis = {
        "CEO": { emoji: "👑", bgColor: "bg-tag-blue-light" },
        "Engineering": { emoji: "⚙️", bgColor: "bg-tag-grey-light" },
        "Sales": { emoji: "📈", bgColor: "bg-tag-green-light" },
        "Consultancy": { emoji: "🧠", bgColor: "bg-tag-orange-light" },
        "Finance": { emoji: "💰", bgColor: "bg-tag-red-light" },
        "Solutioning": { emoji: "💡", bgColor: "bg-yellow-100" },
        "IT": { emoji: "💻", bgColor: "bg-tag-grey-dark" },
        "HR": { emoji: "👥", bgColor: "bg-pink-100" }
    };


    const departments = useMemo(() => {
        return Array.from(new Set(scheduleData.flatMap(item => item.departments.map(dept => dept.department))))
            .map((department, index) => ({ id: index + 1, name: department }));
    }, [scheduleData]);
    
    const teams = useMemo(() => {
        return departments.reduce((acc, dept) => {
            const departmentName = dept.name;
            const uniqueTeams = Array.from(new Set(scheduleData.flatMap(item =>
                item.departments.find(d => d.department === departmentName)?.teams.map(team => team.team) || []
            )));
            acc[dept.id] = uniqueTeams.map((team, index) => ({ id: index + 1, name: team }));
            return acc;
        }, {});
    }, [scheduleData, departments]);

    useEffect(() => {
        const updateScheduleData = () => {
            let filteredData = scheduleData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startOfMonth(currentMonth) && itemDate <= endOfMonth(currentMonth);
            }); 
    
            if (selectedDepartment) {
                const department = departments.find(dept => dept.id === selectedDepartment);
                filteredData = filteredData.map(item => ({
                    ...item,
                    departments: item.departments.filter(d => d.department === department.name)
                }));
            }

            if (selectedTeam) {
                const department = departments.find(dept => dept.id === selectedDepartment);
                const team = teams[selectedDepartment]?.find(t => t.id === selectedTeam);
                filteredData = filteredData.map(item => ({
                    ...item,
                    departments: item.departments.map(dept => ({
                        ...dept,
                        teams: dept.teams.filter(t => t.team === team.name)
                    }))
                }));
            }

            // Update fetchParams with selected department and team NAMES
            setFetchParams(prevParams => ({
                ...prevParams,
                filteredData: [...filteredData], 
                department: selectedDepartment ? departments.find(dept => dept.id === selectedDepartment).name : '',
                team: selectedTeam ? teams[selectedDepartment].find(t => t.id === selectedTeam).name : ''
            }));
        };

        updateScheduleData();
    }, [scheduleData, selectedDepartment, selectedTeam, setFetchParams, departments, teams]);

    const getMembers = (departmentId, teamId, statusFilter = undefined) => {
        const department = departments.find(dept => dept.id === departmentId);
        const team = teams[departmentId]?.find(t => t.id === teamId);
        const startDate = selectedDateRange?.start;
        const endDate = selectedDateRange?.end;

        if (department && team && startDate && endDate) {
            if (startDate.getTime() === endDate.getTime()) { // Single day
                const targetDateUTC = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
                const targetDate = targetDateUTC.toISOString().split('T')[0];
                const membersOnDate = scheduleData.find(item => item.date === targetDate)?.departments
                    .find(d => d.department === department.name)?.teams
                    .find(t => t.team === team.name)?.members || [];

                if (statusFilter) {
                    return membersOnDate.filter(member => member.WFH_Type === statusFilter);
                }

                return membersOnDate.map(member => ({
                    ...member,
                    status: member.WFH_Type
                }));
            } else { // Date range 
                const membersInRange = scheduleData.filter(item => {
                    const itemDate = new Date(item.date);
                    // Remove the month filter here
                    return itemDate >= startDate && itemDate <= endDate;
                }).flatMap(item =>
                    item.departments.find(d => d.department === department.name)?.teams
                        .find(t => t.team === team.name)?.members || []
                );
                // Calculate presence percentage for each member
                const presencePercentage = membersInRange.reduce((acc, member) => {
                    const memberId = member.staffId;
                    const memberCount = acc[memberId]?.count || 0;
                    const memberInCount = acc[memberId]?.inCount || 0;
                    acc[memberId] = {
                        count: memberCount + 1,
                        inCount: memberInCount + (member.WFH_Type === "IN" ? 1 : 0)
                    };
                    return acc;
                }, {});

                const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

                return membersInRange.map((member, index, self) => {
                    const memberId = member.staffId;
                    const memberData = presencePercentage[memberId];
                    const percentage = Math.round((memberData.inCount / memberData.count) * 100);
                    const isFirstOccurrence = self.findIndex(m => m.staffId === memberId) === index;

                    return isFirstOccurrence ? {
                        ...member,
                        percentage: percentage
                    } : null;
                }).filter(Boolean);
            }
        }
        return [];
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "IN":
                return "green";
            case "WFH":
                return "blue";
            case "AWAY":
                return "orange";
            default:
                return "grey";
        }
    };

    const handleDepartmentChange = (departmentId) => {
        if (selectedDepartment === departmentId) {
            setSelectedDepartment(null);
            setSelectedTeam(null);
        } else {
            setSelectedDepartment(departmentId);
            setSelectedTeam(null); // Reset team selection when department changes
        }
    };

    const handleTeamChange = (teamId) => {
        if (selectedTeam === teamId) {
            setSelectedTeam(null);
        } else {
            setSelectedTeam(teamId);
        }
    };


    return (
        <div className="w-[100%] h-[100%] p-4 bg-white shadow-lg overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex justify-between items-center">Departments
                <span className="ml-2 bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                    {departments.length}
                </span></h2>
            <div className='overflow-y-auto max-h-[20vh]'>
                <ul className="mb-6">
                    {departments.map(department => (
                        <li key={department.id}
                            className={`flex justify-between items-center p-2 border-b border-gray-200 rounded-[10px] border-2 mt-1 cursor-pointer 
                    ${selectedDepartment === department.id ? 'bg-green' : ''}`}
                            onClick={() => handleDepartmentChange(department.id)}>
                            <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-xl ${departmentEmojis[department.name]?.bgColor || 'bg-gray-200'}`}> {/* Added circle with bg color */}
                                    {departmentEmojis[department.name]?.emoji || '🏢'}
                                </div>
                                <div className={`font-semibold ${selectedDepartment === department.id ? 'text-white' : 'text-black'}`}>{department.name}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


            {selectedDepartment && teams[selectedDepartment] && (
                <>
                    <h2 className="text-lg font-bold mb-4 flex justify-between items-center">Team
                        <span className="ml-2 bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                            {teams[selectedDepartment].length}</span></h2>
                    <div className='overflow-y-auto max-h-[20vh]'>
                        <ul className="mb-2">
                            {teams[selectedDepartment].map(team => (
                                <li key={team.id}
                                    className={`flex justify-between items-center p-2 border-b border-gray-200 rounded-[10px] border-2 mt-1 cursor-pointer 
                    ${selectedTeam === team.id ? 'bg-green' : ''}`}
                                    onClick={() => handleTeamChange(team.id)}>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 mr-3 text-lg"> {/* Increased size and text size */}
                                            {team.name.charAt(0)}
                                        </div>
                                        <div className={`font-semibold ${selectedTeam === team.id ? 'text-white' : 'text-black'}`}>{team.name}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </>
            )}

            {selectedTeam && (
                <>
                    <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                        {/* "Members" flushed to the left */}
                        <div className="flex items-center">Members</div>

                        {/* Container for Buttons */}
                        <div className="flex space-x-4 items-end">
                            {selectedDateRange?.start?.getTime() === selectedDateRange?.end?.getTime() ? (
                                // Render the 4 buttons if a single day is selected
                                <>
                                    {/* AM Label and Button */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs mb-1">AM</div>
                                        <div className="bg-tag-grey-light text-tag-grey-dark rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold"> {getMembers(selectedDepartment, selectedTeam, "AM").length} </div>
                                    </div>

                                    {/* PM Label and Button */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs mb-1">PM</div>
                                        <div className="bg-tag-grey-light text-tag-grey-dark rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                                            {getMembers(selectedDepartment, selectedTeam, "PM").length}
                                        </div>
                                    </div>

                                    {/* WD Label and Button */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs mb-1">WD</div>
                                        <div className="bg-tag-grey-light text-tag-grey-dark rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                                            {getMembers(selectedDepartment, selectedTeam, "WD").length}
                                        </div>
                                    </div>

                                    {/* IN Label and Button */}
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs mb-1">IN</div>
                                        <div className="bg-tag-green-light text-tag-green-dark rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                                            {getMembers(selectedDepartment, selectedTeam, "IN").length}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Render a single button if more than one day is selected
                                <div className="bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                                    {getMembers(selectedDepartment, selectedTeam).length}
                                </div>
                            )}
                        </div>
                    </h2>
                    <div className='overflow-y-auto max-h-[45vh] h-[45vh] pb-[20vh]'>
                        <ul>
                            {getMembers(selectedDepartment, selectedTeam).map(member => (
                                <li key={member.staffId} className="flex justify-between items-center p-2 border-b border-gray-200 rounded-[10px] border-2 mt-1">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 mr-4">
                                            {member.Staff_FName.charAt(0)}{member.Staff_LName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{`${member.Staff_FName} ${member.Staff_LName}`}</div>
                                        </div>
                                    </div>
                                    <Tag
                                        text={typeof member.percentage !== 'undefined'
                                            ? `${member.percentage}%`
                                            : member.status}
                                        color={getStatusColor(member.status || member.WFH_Type)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default LeftFilterPanel;


