import React from "react";
import { useOffline } from "@/hooks/useOffline";
import { useTheme } from "@/hooks/useTheme";
import { THEME_COLORS } from "@/context/Theme";
import { MkdPopover } from "@/components/MkdPopover";

type PositionTypes = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface OfflineIndicatorProps {
  className?: string;
  showWhenOnline?: boolean;
  position?: PositionTypes | null;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = "",
  showWhenOnline = false,
  position = null,
}) => {
  const { state } = useOffline();
  const { networkStatus, queueStats, showOfflineIndicator } = state;
  const { state: themeState } = useTheme();
  const mode = themeState?.theme;

  // Always show when offline, or when explicitly requested
  if (
    networkStatus.isOnline &&
    !showWhenOnline &&
    !showOfflineIndicator &&
    queueStats.total === 0
  ) {
    return null;
  }

  const positionClasses: Record<PositionTypes, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const getStatusColor = () => {
    if (!networkStatus.isOnline)
      return { backgroundColor: "#EF4444", color: "#FFFFFF" }; // red-500
    if (networkStatus.isSlowConnection)
      return { backgroundColor: "#F59E0B", color: "#FFFFFF" }; // yellow-500
    if (queueStats.total > 0)
      return {
        backgroundColor: THEME_COLORS[mode].PRIMARY,
        color: THEME_COLORS[mode].TEXT_ON_PRIMARY,
      };
    return { backgroundColor: "#10B981", color: "#FFFFFF" }; // green-500
  };

  const getStatusText = () => {
    if (!networkStatus.isOnline) return "Offline";
    if (networkStatus.isSlowConnection) return "Slow Connection";
    if (queueStats.total > 0) return `${queueStats.total} Pending`;
    return "Online";
  };

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return "📴";
    if (networkStatus.isSlowConnection) return "🐌";
    if (queueStats.total > 0) return "⏳";
    return "🟢";
  };

  return (
    <div
      className={`${position && position in positionClasses ? positionClasses[position] + " fixed z-50" : ""} ${className}`}
    >
      <MkdPopover
        display={
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg text-sm font-medium transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
            // style={getStatusColor()}
          >
            <span className="text-base">{getStatusIcon()}</span>
          </div>
        }
        place="top"
        openOnClick={false}
        backgroundColor="#1F2937"
        textColor="#FFFFFF"
        tooltipClasses="!px-3 !py-2 !text-xs !rounded-lg !shadow-lg"
        zIndex={9999}
      >
        <div className="flex items-center space-x-2">
          <span>{getStatusText()}</span>
          {queueStats.total > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span>
                ({queueStats.byPriority.high}H, {queueStats.byPriority.medium}M,{" "}
                {queueStats.byPriority.low}L)
              </span>
            </div>
          )}
        </div>
      </MkdPopover>
    </div>
  );
};

export default OfflineIndicator;
