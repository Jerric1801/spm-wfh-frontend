import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { cn } from '../../utils/tailwindUtils';
import { fetchRequests } from '../../services/endpoints/manageRequests';

// const fetchNotifications = () => {
//   return Promise.resolve([
//     {
//       id: 1,
//       status: 'Approved',
//       date: '28/10-29/10',
//       type: 'WFH FULL DAY',
//       timestamp: '2 min ago'
//     },
//     {
//       id: 2,
//       status: 'Approved',
//       date: '15/09-16/09',
//       type: 'WFH FULL DAY',
//       timestamp: '2 hours ago'
//     },
//     {
//       id: 3,
//       status: 'Rejected',
//       date: '9/09-13/09',
//       type: 'WFH PM',
//       timestamp: '2 hours ago'
//     },
//     {
//       id: 4,
//       status: 'Approved',
//       date: '08/09',
//       type: 'WFH AM',
//       timestamp: '2 days ago'
//     },
//     {
//       id: 5,
//       status: 'Approved',
//       date: '05/09-07/09',
//       type: 'WFH PM',
//       timestamp: '2 days ago'
//     }
//   ]);
// };

const NotificationSystem = ({ userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());

  useEffect(() => {
    // Function to fetch notifications
    const getNotifications = async () => {
      try {
        const data = await fetchRequests(true); // Assuming `true` indicates summary data for notifications
        setNotifications(data);

        // Check for new notifications since last check
        const hasNew = data.some(notification =>
          new Date(notification.timestamp) > new Date(lastChecked)
        );
        setHasUnread(hasNew);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial call to fetch notifications
    getNotifications();

    // Poll for new notifications every minute -> cron job
    const interval = setInterval(getNotifications, 60000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications === false) {
      setHasUnread(false);
      setLastChecked(Date.now());
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <div className="relative notification-container">
      {/* Notification Icon with Badge */}
      <button 
        onClick={handleNotificationClick}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {hasUnread && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Notification Popup */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg z-50 bg-white border border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Notifications This Week</h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.status === 'Approved' 
                    ? 'bg-light-green'
                    : 'bg-light-red'
              }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {notification.status === 'Approved' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        notification.status === 'Approved'
                          ? 'text-green'
                          : 'text-red'
                      }`}>
                        {notification.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {notification.date}: {notification.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;