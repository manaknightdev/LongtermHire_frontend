import { useState, useEffect, useCallback, useRef } from "react";

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  lastOnlineTime?: number;
  lastOfflineTime?: number;
}

export interface UseNetworkStatusOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  onConnectionChange?: (status: NetworkStatus) => void;
  pingUrl?: string;
  pingInterval?: number;
  enablePing?: boolean;
}

/**
 * Hook for detecting and monitoring network status
 */
export const useNetworkStatus = (options: UseNetworkStatusOptions = {}) => {
  const {
    onOnline,
    onOffline,
    onConnectionChange,
    pingUrl = "/favicon.ico",
    pingInterval = 5000,
    enablePing = false,
  } = options;

  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    const connection = getConnectionInfo();
    return {
      isOnline: navigator.onLine,
      isSlowConnection: isSlowConnection(connection),
      connectionType: connection?.type,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      lastOnlineTime: navigator.onLine ? Date.now() : undefined,
      lastOfflineTime: !navigator.onLine ? Date.now() : undefined,
    };
  });

  const pingTimeoutRef = useRef<number>();
  const lastPingRef = useRef<number>(0);

  const updateNetworkStatus = useCallback(
    (isOnline: boolean) => {
      const connection = getConnectionInfo();
      const newStatus: NetworkStatus = {
        isOnline,
        isSlowConnection: isSlowConnection(connection),
        connectionType: connection?.type,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
        lastOnlineTime: isOnline ? Date.now() : networkStatus.lastOnlineTime,
        lastOfflineTime: !isOnline ? Date.now() : networkStatus.lastOfflineTime,
      };

      setNetworkStatus((prevStatus) => {
        // Only update if status actually changed
        if (
          prevStatus.isOnline !== newStatus.isOnline ||
          prevStatus.connectionType !== newStatus.connectionType ||
          prevStatus.effectiveType !== newStatus.effectiveType
        ) {
          onConnectionChange?.(newStatus);

          if (prevStatus.isOnline !== newStatus.isOnline) {
            if (newStatus.isOnline) {
              onOnline?.();
            } else {
              onOffline?.();
            }
          }

          return newStatus;
        }
        return prevStatus;
      });
    },
    [networkStatus.lastOnlineTime, onConnectionChange, onOnline, onOffline]
  );

  const performPing = useCallback(async (): Promise<boolean> => {
    if (!enablePing) return navigator.onLine;

    const now = Date.now();
    if (now - lastPingRef.current < 3000) {
      // Don't ping more than once every 3 seconds
      return networkStatus.isOnline;
    }

    lastPingRef.current = now;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      // Try multiple ping strategies
      const pingPromises = [
        // Strategy 1: Try to fetch a small resource
        // fetch(pingUrl + "?t=" + Date.now(), {
        //   method: "HEAD",
        //   mode: "no-cors",
        //   cache: "no-cache",
        //   signal: controller.signal,
        // }),
        // Strategy 2: Try to fetch Google's favicon (reliable)
        fetch("https://www.google.com/favicon.ico?t=" + Date.now(), {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-cache",
          signal: controller.signal,
        }),
      ];

      // If any ping succeeds, we're online
      await Promise.any(pingPromises);
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.warn("Network ping failed:", error);
      // Fallback to navigator.onLine if ping fails
      if (!enablePing) return navigator.onLine;

      return false;
    }
  }, [enablePing, pingUrl]);

  const checkNetworkStatus = useCallback(async () => {
    const isOnline = await performPing();
    updateNetworkStatus(isOnline);
  }, [performPing, updateNetworkStatus]);

  // Manual network check
  const refreshNetworkStatus = useCallback(() => {
    checkNetworkStatus();
  }, [checkNetworkStatus]);

  // Get detailed connection info
  const getDetailedConnectionInfo = useCallback((): NetworkStatus => {
    return { ...networkStatus };
  }, [networkStatus]);

  // Check if connection is suitable for heavy operations
  const isSuitableForHeavyOperations = useCallback((): boolean => {
    if (!networkStatus.isOnline) return false;
    if (networkStatus.saveData) return false;
    if (networkStatus.isSlowConnection) return false;

    return true;
  }, [networkStatus]);

  // Get connection quality score (0-100)
  const getConnectionQuality = useCallback((): number => {
    if (!networkStatus.isOnline) return 0;

    let score = 50; // Base score for being online

    if (networkStatus.effectiveType) {
      switch (networkStatus.effectiveType) {
        case "4g":
          score += 40;
          break;
        case "3g":
          score += 20;
          break;
        case "2g":
          score += 5;
          break;
        case "slow-2g":
          score += 0;
          break;
      }
    }

    if (networkStatus.downlink) {
      if (networkStatus.downlink > 10) score += 10;
      else if (networkStatus.downlink > 1.5) score += 5;
    }

    if (networkStatus.rtt) {
      if (networkStatus.rtt < 100) score += 10;
      else if (networkStatus.rtt < 300) score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }, [networkStatus]);

  useEffect(() => {
    const handleOnline = () => {
      console.log("🟢 Browser online event triggered");
      updateNetworkStatus(true);
    };
    const handleOffline = () => {
      console.log("🔴 Browser offline event triggered");
      updateNetworkStatus(false);
    };
    const handleConnectionChange = () => {
      console.log(
        "🔄 Connection change event triggered, navigator.onLine:",
        navigator.onLine
      );
      updateNetworkStatus(navigator.onLine);
    };

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for connection changes
    const connection = getConnectionInfo();
    if (connection) {
      connection.addEventListener("change", handleConnectionChange);
    }

    // Set up periodic ping if enabled
    let pingIntervalId: number | undefined;
    if (enablePing) {
      pingIntervalId = setInterval(() => {
        console.log("🔍 Performing periodic network check");
        checkNetworkStatus();
      }, pingInterval);
      pingTimeoutRef.current = pingIntervalId;
    }

    // Initial check
    console.log("🚀 Initial network status check");
    checkNetworkStatus();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if (connection) {
        connection.removeEventListener("change", handleConnectionChange);
      }

      if (pingIntervalId) {
        clearInterval(pingIntervalId);
      }
    };
  }, [enablePing, pingInterval]); // Removed updateNetworkStatus and checkNetworkStatus from dependencies

  return {
    networkStatus,
    isOnline: networkStatus.isOnline,
    isOffline: !networkStatus.isOnline,
    isSlowConnection: networkStatus.isSlowConnection,
    connectionType: networkStatus.connectionType,
    effectiveType: networkStatus.effectiveType,
    refreshNetworkStatus,
    getDetailedConnectionInfo,
    isSuitableForHeavyOperations,
    getConnectionQuality,
  };
};
console.log("navigator.onLine >>", navigator.onLine);
// Helper functions
function getConnectionInfo(): any {
  return (
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection
  );
}

function isSlowConnection(connection: any): boolean {
  if (!connection) return false;

  const slowTypes = ["slow-2g", "2g"];
  if (slowTypes.includes(connection.effectiveType)) return true;

  if (connection.downlink && connection.downlink < 1.5) return true;
  if (connection.rtt && connection.rtt > 300) return true;

  return false;
}

export default useNetworkStatus;
