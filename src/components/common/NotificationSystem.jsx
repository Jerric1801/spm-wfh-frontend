import React, { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import {
  getNotifications,
  acceptNotifications,
} from "../../services/endpoints/notifications";

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());

  // Function to convert date to YYYY-MM-DD format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extract only the YYYY-MM-DD part
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    console.log("💻 API: getNotifications called"); // Log when the API is called
    try {
      const res = await getNotifications();
      console.log("📮 Notifications API Response:", res); // Log the API response

      let parsedNotifications = [];

      // Parse manager notifications
      if (res.data.manager) {
        parsedNotifications = parsedNotifications.concat(
          res.data.manager.map((notification) => ({
            id: notification.requestId,
            status:
              notification.currentStatus === "Pending"
                ? "Pending"
                : notification.currentStatus === "Rejected"
                ? "Rejected"
                : "Withdrawn",
            type: "Manager Notification",
            earliestDate: formatDate(notification.earliestDate), // Format the date
            latestDate: formatDate(notification.latestDate), // Format the date
          }))
        );
      }

      // Parse user notifications
      if (res.data.user) {
        parsedNotifications = parsedNotifications.concat(
          res.data.user.map((notification) => ({
            id: notification.requestId,
            status: notification.currentStatus,
            type: "User Notification",
            earliestDate: formatDate(notification.earliestDate), // Format the date
            latestDate: formatDate(notification.latestDate), // Format the date
            managerReason: notification.Manager_Reason || null, // Add manager reason if available
          }))
        );
      }

      setNotifications(parsedNotifications);
      console.log("🔔 Parsed Notifications:", parsedNotifications); // Log parsed notifications

      // Check for new notifications since the last check
      const hasNew = parsedNotifications.some(
        (notification) =>
          new Date(notification.timestamp) > new Date(lastChecked)
      );
      setHasUnread(hasNew);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Initial fetch of notifications
    fetchNotifications();

    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications === false) {
      setHasUnread(false);
      setLastChecked(Date.now());
    }
  };

  // Function to clear notifications
  const clearNotifications = async () => {
    const notificationIds = notifications.map(
      (notification) => notification.id
    );
    console.log(notificationIds);
    try {
      console.log("🚀 Clearing Notifications with IDs:", notificationIds);
      const response = await acceptNotifications({
        requestIdArr: notificationIds,
      });
      console.log("✅ Notifications cleared response:", response);
      setNotifications([]); // Clear notifications from state
      setHasUnread(false);
    } catch (error) {
      console.error("❌ Error clearing notifications:", error);
    }
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notification-container")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Aggregate pending and withdrawn notifications
  const pendingCount = notifications.filter(
    (n) => n.status === "Pending"
  ).length;
  const withdrawnCount = notifications.filter(
    (n) => n.status === "Withdrawn"
  ).length;

  return (
    <div className="relative notification-container">
      {/* Notification Icon with Badge */}
      <button
        onClick={handleNotificationClick}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {hasUnread && !showNotifications && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
        )}
      </button>

      {/* Notification Popup */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg z-50 bg-white border border-gray-200">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Notifications This Week</h3>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                <>
                  {pendingCount > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-yellow-700" />
                        <span className="font-medium text-yellow-700">
                          {pendingCount} Pending Requests
                        </span>
                      </div>
                    </div>
                  )}
                  {withdrawnCount > 0 && (
                    <div className="p-3 rounded-lg bg-blue-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-700" />
                        <span className="font-medium text-blue-700">
                          {withdrawnCount} Withdrawn Requests
                        </span>
                      </div>
                    </div>
                  )}
                  {notifications
                    .filter(
                      (n) => n.status !== "Pending" && n.status !== "Withdrawn"
                    )
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${
                          notification.status === "Approved"
                            ? "bg-light-green"
                            : "bg-light-red"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {notification.status === "Approved" ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                            <span
                              className={`font-medium ${
                                notification.status === "Approved"
                                  ? "text-green"
                                  : "text-red"
                              }`}
                            >
                              {notification.status}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-bold">
                            Request ID: {notification.id}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {notification.earliestDate} to{" "}
                          {notification.latestDate}
                        </div>
                        {notification.status === "Rejected" &&
                          notification.managerReason && (
                            <div className="text-sm text-gray-500 mt-1">
                              Manager Reason:<br/>
                              {notification.managerReason}
                            </div>
                          )}
                      </div>
                    ))}

                  {/* Clear Notifications Button */}
                  <button
                    onClick={clearNotifications}
                    className="mt-4 w-full border border-red text-red py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear Notifications
                  </button>
                </>
              ) : (
                <p className="text-gray-500">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;

