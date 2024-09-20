import React, { useState } from 'react';

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

    // State for selected department and team
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div className="w-[100%] h-[100%] p-4 bg-white shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Departments</h2>
            <ul className="mb-6">
                {departments.map(department => (
                    <li key={department.id}>
                        <button 
                            className={`w-full text-left p-2 ${selectedDepartment === department.id ? 'bg-green-200' : 'bg-white'}`}
                            onClick={() => {
                                setSelectedDepartment(department.id);
                                setSelectedTeam(null); // Reset team selection when a new department is selected
                            }}
                        >
                            {department.name}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedDepartment && (
                <>
                    <h2 className="text-lg font-semibold mb-4">Team</h2>
                    <ul className="mb-6">
                        {teams[selectedDepartment].map(team => (
                            <li key={team.id}>
                                <button 
                                    className={`w-full text-left p-2 ${selectedTeam === team.id ? 'bg-green-200' : 'bg-white'}`}
                                    onClick={() => setSelectedTeam(team.id)}
                                >
                                    {team.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {selectedTeam && (
                <>
                    <h2 className="text-lg font-semibold mb-4">Members</h2>
                    <ul>
                        {members[selectedTeam].map(member => (
                            <li key={member.id} className="flex justify-between p-2 border-b">
                                <span>{member.name}</span>
                                <span className={`status-${member.status.toLowerCase()}`}>{member.status}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default LeftFilterPanel;


