import { useState, useEffect } from 'react';
import SettingsIcon from "../../assets/images/settings_icon.png";
import NotificationSystem from '../../components/common/NotificationSystem.jsx'

const flagDictionary = {
    'Singapore': '🇸🇬',
    'Hong Kong': '🇭🇰',
    'Vietnam': '🇻🇳',
    'Indonesia ': '🇮🇩',
    'Malaysia': '🇲🇾'
};



function TopProfileBar() {
    const [staffName, setStaffName] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        // Get staff details from localStorage
        const staffData = JSON.parse(localStorage.getItem('staff') || '{}');
        setStaffName(staffData.staffName || 'Guest');
        setCountry(staffData.country || 'Unknown');
    }, []);

    // Function to get initials from staffName
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        let initials = nameParts[0].charAt(0).toUpperCase();
        if (nameParts.length > 1) {
            initials += nameParts[nameParts.length - 1].charAt(0).toUpperCase();
        }
        return initials;
    };
    return (
        <div className="w-full h-full flex justify-between items-center px-5 py-3"> 

            {/* Left side text */}
            <div>
                <h2 className="font-bold text-lg"> 
                    All In One WFH Schedule 🗓️
                </h2>
                <p className="text-gray-600">Every Print Matters</p>
            </div>

            {/* Right side */}
            <div className="flex items-center"> 
                {country && (
                    <span className="text-2xl mr-3"> 
                        {flagDictionary[country] || ''}
                    </span>
                )}

                <div className="hover:bg-green p-2 rounded-full transition-colors">
                 <NotificationSystem/>
                </div>

                <button className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                 <img src={SettingsIcon} alt="Settings icon" className="mr-3 w-6" /> 
                </button>
                <div className="bg-gray-300 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-3"> 
                    {getInitials(staffName)}
                </div>
                <h1 className="text-gray-700 font-bold"> 
                    {staffName}
                </h1>
            </div>
        </div>
    );
}

export default TopProfileBar;