import { createContext, useState, useEffect, useMemo } from 'react';
import { getSchedule } from '../services/endpoints/schedule';
import { fetchRequests } from '../services/endpoints/manageRequests'
import { startOfMonth, endOfMonth, addMonths } from 'date-fns'; 

const ScheduleContext = createContext();

const ScheduleProvider = ({ children }) => {
    const [scheduleData, setScheduleData] = useState([]);
    const [staffRequests, setStaffRequests] = useState([]); 
    const [currentMonth, setCurrentMonth] = useState(new Date()); 
    const [fetchParams, setFetchParams] = useState({ 
        filteredData: scheduleData,
        department: '',
        team: ''
    }); 
    const [lastFetchedMonth, setLastFetchedMonth] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            console.log('💻 API 1: getSchedule called')
            if (lastFetchedMonth && 
                currentMonth.getMonth() === lastFetchedMonth.getMonth() &&
                currentMonth.getFullYear() === lastFetchedMonth.getFullYear()) {
                return; 
            }
            try {
                const start = startOfMonth(currentMonth); 
                const end = endOfMonth(currentMonth); 
                
                const startUTC = new Date(start.getTime() - start.getTimezoneOffset() * 60000);
                const endUTC = new Date(end.getTime() - end.getTimezoneOffset() * 60000);
                
                const scheduleParams = {
                    startDate: startUTC.toISOString().split('T')[0],
                    endDate: endUTC.toISOString().split('T')[0],
                }; 

                const data = await getSchedule(scheduleParams);

                setScheduleData(data);
                setLastFetchedMonth(currentMonth);

                setFetchParams(prevParams => ({
                    ...prevParams,
                    filteredData: data 
                }));

            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };

        const fetchStaffRequests = async () => { 
            console.log('💻 API 2: fetchRequests called')
            try {
                const data = await fetchRequests();
                console.log(data)
                setStaffRequests(data);
            } catch (error) {
                console.error("Error fetching staff requests:", error);
            }
        }

        fetchSchedule();
        fetchStaffRequests();
    }, [currentMonth, lastFetchedMonth]);

    const contextValue = useMemo(() => ({
        scheduleData,
        staffRequests,
        currentMonth, 
        setCurrentMonth,
        setFetchParams,
        fetchParams   
    }), [scheduleData, staffRequests, currentMonth, setFetchParams, fetchParams]); 

    return (
        <ScheduleContext.Provider value={contextValue}>
            {children}
        </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleProvider };