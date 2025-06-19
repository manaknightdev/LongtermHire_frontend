import React, { useState, useEffect } from "react";
import { useOffline } from "@/hooks/useOffline";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type PositionTypes = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface OfflineDebuggerProps {
  className?: string;
  position?: PositionTypes | null;
}

export const OfflineDebugger: React.FC<OfflineDebuggerProps> = ({
  className = "",
  position = "bottom-left",
}) => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [manualOffline, setManualOffline] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Try to get offline context
  let offlineContext = useOffline();
  let offlineError = null;

  // Test network status hook directly
  const networkStatus = useNetworkStatus({
    enablePing: true,
    pingInterval: 5000, // Increased interval to reduce updates
    onOnline: () => console.log("🟢 Network hook: ONLINE"),
    onOffline: () => console.log("🔴 Network hook: OFFLINE"),
    onConnectionChange: (status) => console.log("🔄 Network change:", status),
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo((prev: any) => {
        const newInfo = {
          navigatorOnline: navigator.onLine,
          networkHookStatus: {
            isOnline: networkStatus.isOnline,
            connectionType: networkStatus.connectionType,
            effectiveType: networkStatus.effectiveType,
            isSlowConnection: networkStatus.isSlowConnection,
          },
          offlineContextAvailable: !!offlineContext,
          offlineContextError: null,
          offlineState: offlineContext?.state
            ? {
                networkOnline: offlineContext.state.networkStatus.isOnline,
                queueTotal: offlineContext.state.queueStats.total,
                showIndicator: offlineContext.state.showOfflineIndicator,
              }
            : null,
          timestamp: new Date().toISOString(),
        };

        // Only update if something actually changed
        if (JSON.stringify(prev) !== JSON.stringify(newInfo)) {
          return newInfo;
        }
        return prev;
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000); // Less frequent updates

    // Add manual event listeners for debugging
    const handleOnline = () => {
      console.log("🟢 Browser event: ONLINE");
      setTimeout(updateDebugInfo, 100); // Delay to avoid rapid updates
    };
    const handleOffline = () => {
      console.log("🔴 Browser event: OFFLINE");
      setTimeout(updateDebugInfo, 100); // Delay to avoid rapid updates
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Remove dependencies that cause infinite loops

  const positionClasses: Record<PositionTypes, string> = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const simulateOffline = () => {
    setManualOffline(!manualOffline);
    // Try to manually trigger offline mode
    if (offlineContext?.actions) {
      if (manualOffline) {
        offlineContext.actions.showOfflineMode();
      } else {
        offlineContext.actions.hideOfflineMode();
      }
    }
  };

  return (
    <div
      className={`${position && position in positionClasses ? positionClasses[position] + " fixed z-50" : "fixed bottom-4 left-4 z-50"} ${className} bg-white border border-gray-300 rounded-lg shadow-lg max-w-md`}
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-bold text-lg">🔧 Offline Debug Panel</h3>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold w-6 h-6 flex items-center justify-center"
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>

      {!isMinimized && (
        <div className="px-4 pb-4 max-h-96 overflow-auto">
          <div className="space-y-2 text-sm">
            <div>
              <strong>Navigator Online:</strong>
              <span
                className={navigator.onLine ? "text-green-600" : "text-red-600"}
              >
                {navigator.onLine ? " ✅ Online" : " ❌ Offline"}
              </span>
            </div>

            <div>
              <strong>Network Hook Status:</strong>
              <div className="ml-2">
                <div>
                  isOnline:{" "}
                  <span
                    className={
                      networkStatus.isOnline ? "text-green-600" : "text-red-600"
                    }
                  >
                    {networkStatus.isOnline ? "✅" : "❌"}
                  </span>
                </div>
                <div>
                  connectionType: {networkStatus.connectionType || "unknown"}
                </div>
                <div>
                  effectiveType: {networkStatus.effectiveType || "unknown"}
                </div>
              </div>
            </div>

            <div>
              <strong>Offline Context:</strong>
              {offlineError ? (
                <div className="text-red-600">
                  ❌ Error: {(offlineError as Error)?.message}
                </div>
              ) : offlineContext ? (
                <div className="ml-2">
                  <div>✅ Available</div>
                  <div>
                    Network Online:{" "}
                    <span
                      className={
                        offlineContext.state.networkStatus.isOnline
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {offlineContext.state.networkStatus.isOnline
                        ? "✅"
                        : "❌"}
                    </span>
                  </div>
                  <div>
                    Queue Total: {offlineContext.state.queueStats.total}
                  </div>
                  <div>
                    Show Indicator:{" "}
                    {offlineContext.state.showOfflineIndicator ? "✅" : "❌"}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">❌ Not Available</div>
              )}
            </div>

            <div className="pt-2 border-t">
              <button
                onClick={simulateOffline}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                {manualOffline ? "Hide" : "Show"} Offline Mode
              </button>
            </div>

            <div className="pt-2 border-t">
              <button
                onClick={() => networkStatus.refreshNetworkStatus()}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Refresh Network Status
              </button>
            </div>

            <div className="pt-2 text-xs text-gray-500">
              Last Update:{" "}
              {new Date(debugInfo.timestamp || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineDebugger;
