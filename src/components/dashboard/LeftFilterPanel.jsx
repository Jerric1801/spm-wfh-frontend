import React, { useState } from 'react';
import Button from '../common/Button'; 
import Tag from '../common/Tag';


function LeftFilterPanel() {
    // Dummy data
    const departments = [
        { id: 1, name: "System Solutioning" },
        { id: 2, name: "Sales" },
        { id: 3, name: "Consultancy" },
        { id: 4, name: "Finance" },
    ];

    const teams = {
        1: [{ id: 1, name: "Team 1" }, { id: 2, name: "Team 2" }],
        2: [{ id: 3, name: "Team 3" }],
        3: [{ id: 4, name: "Team 4" }],
        4: [{ id: 5, name: "Team 5" }]
    };

    const members = {
        1: [{ id: 1, name: "Eric Loh", role: "Director", status: "IN" },
            { id: 2, name: "Meredith", role: "Solution Architect", status: "IN" }],
        2: [{ id: 3, name: "James", role: "Solution Architect", status: "WFH" },
            { id: 4, name: "Robert", role: "Solution Architect", status: "AWAY" }],
        3: [{ id: 5, name: "John", role: "Solution Architect", status: "IN"}],
        4: [{ id: 6, name: "Alex", role:"Consultant", status: "AWAY"}],
        5: [{ id: 7, name: "Sam", role:"Finance Staff", status: "IN"}]
    };


    // Calculate the total number of teams and members
     const totalTeams = Object.values(teams).reduce((total, teamArr) => total + teamArr.length, 0);
     const totalMembers = Object.values(members).reduce((total, memberArr) => total + memberArr.length, 0);

    // State for selected department and team
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

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

    return (
        <div className="w-[100%] h-[100%] p-4 bg-white shadow-lg">
            <h2 className="text-lg font-bold mb-4 flex justify-between items-center">Departments
                <span className="ml-2 bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                    {departments.length}
                    </span></h2>
            <ul className="mb-6">
                {departments.map(department => (
                    <li key={department.id}>
                        <Button 
                          text ={department.name}
                          width ="100%"
                          isSelected={selectedDepartment === department.id}
                          onClick={() => {
                                setSelectedDepartment(department.id);
                                setSelectedTeam(null); // Reset team selection when a new department is selected
                            }}
                        />
                    </li>
                ))}
            </ul>

            {selectedDepartment && (
                <>
                    <h2 className="text-lg font-bold mb-4 flex justify-between items-center">Team
                        <span className="ml-2 bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                        {teams[selectedDepartment].length}</span></h2>
                    <ul className="mb-6">
                        {teams[selectedDepartment].map(team => (
                            <li key={team.id}>
                                <Button 
                                    text ={team.name}
                                    width ="100%"
                                    isSelected={selectedTeam === team.id}
                                    onClick={() => setSelectedTeam(team.id)}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {selectedTeam && (
                <>
                    <h2 className="text-lg font-bold mb-4 flex justify-between items-center">Members
                        <span className="ml-2 bg-black text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-bold">
                        {members[selectedTeam].length}
                        </span>
                        </h2>
                    <ul>
                        {members[selectedTeam].map(member => (
                            <li key={member.id} className="flex justify-between items-center p-2 border-b border-gray-200 rounded-[10px] border-2 ">
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <img src={`https://randomuser.me/api/portraits/med/men/${member.id}.jpg`} alt={member.name} className="w-10 h-10 rounded-full" /> 
                                    </div>
                                    <div>
                                        <div className="font-semibold">{member.name}</div>
                                        <div className="text-sm text-gray-500">{member.role}</div>
                                    </div>
                                </div>
                                <Tag text={member.status} color={getStatusColor(member.status)} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default LeftFilterPanel;


