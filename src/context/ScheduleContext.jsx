import { createContext, useState, useEffect } from 'react';
import { getSchedule } from '../services/endpoints/schedule';

const ScheduleContext = createContext();

const ScheduleProvider = ({ children }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

                const scheduleParams = {
                    startDate: startOfMonth.toISOString().split('T')[0],
                    endDate: endOfMonth.toISOString().split('T')[0],
                };

                const data = await getSchedule(scheduleParams);
                setScheduleData(data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };

        fetchSchedule();
    }, [currentMonth]); // Dependency array includes fetchParams

    const contextValue = {
        scheduleData,
        currentMonth,
        setCurrentMonth
    };

    return (
        <ScheduleContext.Provider value={contextValue}>
            {children}
        </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleProvider };