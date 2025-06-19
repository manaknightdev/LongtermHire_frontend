import React from "react";
import { useOffline } from "@/hooks/useOffline";
import { OfflineNotification } from "@/context/Offline/types";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";

interface OfflineNotificationsProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  maxNotifications?: number;
}

export const OfflineNotifications: React.FC<OfflineNotificationsProps> = ({
  className = "",
  position = "top-right",
  maxNotifications = 5,
}) => {
  const { state, actions } = useOffline();
  const { notifications } = state;
  const { state: themeState } = useTheme();
  const mode = themeState?.theme;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const getNotificationIcon = (type: OfflineNotification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColors = (type: OfflineNotification["type"]) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#10B981",
          borderLeftColor: "#059669",
          color: "#FFFFFF",
        };
      case "error":
        return {
          backgroundColor: "#EF4444",
          borderLeftColor: "#DC2626",
          color: "#FFFFFF",
        };
      case "warning":
        return {
          backgroundColor: "#F59E0B",
          borderLeftColor: "#D97706",
          color: "#FFFFFF",
        };
      case "info":
        return {
          backgroundColor: THEME_COLORS[mode].PRIMARY,
          borderLeftColor: THEME_COLORS[mode].PRIMARY_ACTIVE,
          color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
        };
      default:
        return {
          backgroundColor: THEME_COLORS[mode].BACKGROUND_SECONDARY,
          borderLeftColor: THEME_COLORS[mode].BORDER,
          color: THEME_COLORS[mode].TEXT,
        };
    }
  };

  const displayedNotifications = notifications.slice(0, maxNotifications);

  if (displayedNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <div className="space-y-2 max-w-sm">
        {displayedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => actions.removeNotification(notification.id)}
            getIcon={getNotificationIcon}
            getColors={getNotificationColors}
          />
        ))}
      </div>
    </div>
  );
};

interface NotificationItemProps {
  notification: OfflineNotification;
  onClose: () => void;
  getIcon: (type: OfflineNotification["type"]) => string;
  getColors: (type: OfflineNotification["type"]) => {
    backgroundColor: string;
    borderLeftColor: string;
    color: string;
  };
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
  getIcon,
  getColors,
}) => {
  const notificationStyles = getColors(notification.type);

  return (
    <div
      className="p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out hover:scale-105"
      style={notificationStyles}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-sm opacity-90 break-words">
              {notification.message}
            </p>

            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="
                      px-3 py-1 text-xs font-medium rounded
                      bg-white bg-opacity-20 hover:bg-opacity-30
                      transition-colors duration-200
                    "
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {!notification.persistent && (
          <button
            onClick={onClose}
            className="
              ml-2 flex-shrink-0 text-white hover:text-gray-200
              transition-colors duration-200
            "
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="mt-2 text-xs opacity-75">
        {new Date(notification.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default OfflineNotifications;
