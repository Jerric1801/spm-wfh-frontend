import { createContext, useState, useEffect, useMemo } from 'react';
import { getSchedule } from '../services/endpoints/schedule';

const ScheduleContext = createContext();

const ScheduleProvider = ({ children }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [fetchParams, setFetchParams] = useState({ 
        department: '',
        team: ''
    }); 


    useEffect(() => {
        const fetchSchedule = async () => {
            console.log('fetching')
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
    }, [currentMonth, fetchParams]);

    const contextValue = useMemo(() => ({
        scheduleData,
        currentMonth, 
        setCurrentMonth,
        setFetchParams,
        fetchParams   
    }), [scheduleData, currentMonth, setFetchParams ]); 

    return (
        <ScheduleContext.Provider value={contextValue}>
            {children}
        </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleProvider };