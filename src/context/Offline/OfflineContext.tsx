import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { OfflineService } from "@/utils/offline/OfflineService";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  OfflineContextType,
  OfflineProviderProps,
  OfflineNotification,
} from "./types";
import { offlineReducer, initialState } from "./OfflineReducer";

const OfflineContext = createContext<OfflineContextType | null>(null);

export const OfflineProvider: React.FC<OfflineProviderProps> = ({
  children,
  config = {},
  enableNotifications = true,
  enableAutoSync: _enableAutoSync = true,
}) => {
  const [state, dispatch] = useReducer(offlineReducer, {
    ...initialState,
    config: { ...initialState.config, ...config },
  });

  const offlineServiceRef = useRef<OfflineService | null>(null);
  const notificationTimeoutsRef = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());

  const { networkStatus, refreshNetworkStatus } = useNetworkStatus({
    onOnline: () => {
      if (enableNotifications) {
        addNotification({
          type: "success",
          title: "Back Online",
          message: "Connection restored. Syncing pending changes...",
        });
      }
    },
    onOffline: () => {
      if (enableNotifications) {
        addNotification({
          type: "warning",
          title: "Offline Mode",
          message: "You are now offline. Changes will be saved locally.",
          // persistent: true,
        });
      }
    },
    enablePing: true,
  });

  // Initialize offline service
  useEffect(() => {
    const initializeOfflineService = async () => {
      try {
        offlineServiceRef.current = new OfflineService(state.config);
        await offlineServiceRef.current.initialize();

        // Set up event listeners
        const service = offlineServiceRef.current;

        service.on("network-status-changed", (status) => {
          dispatch({ type: "SET_NETWORK_STATUS", payload: status });
        });

        service.on("sync-started", () => {
          dispatch({ type: "SET_SYNC_INDICATOR", payload: true });
        });

        service.on("sync-completed", (result) => {
          dispatch({ type: "SET_SYNC_INDICATOR", payload: false });
          updateQueueStats();

          if (enableNotifications && result.success > 0) {
            addNotification({
              type: "success",
              title: "Sync Complete",
              message: `${result.success} changes synced successfully.`,
            });
          }
        });

        service.on("sync-failed", ({ error }) => {
          dispatch({ type: "SET_SYNC_INDICATOR", payload: false });

          if (enableNotifications) {
            addNotification({
              type: "error",
              title: "Sync Failed",
              message: `Failed to sync changes: ${error}`,
            });
          }
        });

        service.on("request-queued", () => {
          updateQueueStats();
        });

        // Initial status update
        dispatch({
          type: "SET_NETWORK_STATUS",
          payload: service.getNetworkStatus(),
        });
        dispatch({ type: "SET_SYNC_STATUS", payload: service.getSyncStatus() });
        updateQueueStats();
      } catch (error) {
        console.error("Failed to initialize offline service:", error);
        if (enableNotifications) {
          addNotification({
            type: "error",
            title: "Offline Service Error",
            message: "Failed to initialize offline capabilities.",
          });
        }
      }
    };

    initializeOfflineService();

    return () => {
      if (offlineServiceRef.current) {
        offlineServiceRef.current.destroy();
      }
      // Clear all notification timeouts
      notificationTimeoutsRef.current.forEach((timeout) =>
        clearTimeout(timeout)
      );
      notificationTimeoutsRef.current.clear();
    };
  }, []);

  // Update network status from hook and sync with offline service
  useEffect(() => {
    console.log("🔄 Network status changed in OfflineContext:", networkStatus);
    dispatch({ type: "SET_NETWORK_STATUS", payload: networkStatus });

    // Update the offline service's network status
    if (offlineServiceRef.current) {
      const service = offlineServiceRef.current;
      const currentServiceStatus = service.getNetworkStatus();

      // Only update if there's a difference
      if (currentServiceStatus.isOnline !== networkStatus.isOnline) {
        console.log(
          `🔄 Updating OfflineService network status: ${currentServiceStatus.isOnline} -> ${networkStatus.isOnline}`
        );

        // Manually trigger the service's network status change
        if (networkStatus.isOnline) {
          service.handleOnline();
        } else {
          service.handleOffline();
        }
      }
    }

    // Update offline indicator visibility
    const shouldShowIndicator = !networkStatus.isOnline;
    if (state.showOfflineIndicator !== shouldShowIndicator) {
      dispatch({ type: "SET_OFFLINE_INDICATOR", payload: shouldShowIndicator });
    }
  }, [networkStatus, state.showOfflineIndicator]);

  const updateQueueStats = useCallback(async () => {
    if (!offlineServiceRef.current) return;

    try {
      const requests = await offlineServiceRef.current.getQueuedRequests();
      const stats = {
        total: requests.length,
        byPriority: { high: 0, medium: 0, low: 0 },
        byOperation: { create: 0, update: 0, delete: 0, custom: 0 },
        oldestTimestamp:
          requests.length > 0
            ? Math.min(...requests.map((r) => r.timestamp))
            : undefined,
      };

      requests.forEach((request) => {
        stats.byPriority[request.priority]++;
        stats.byOperation[request.operation]++;
      });

      dispatch({ type: "SET_QUEUE_STATS", payload: stats });
    } catch (error) {
      console.error("Failed to update queue stats:", error);
    }
  }, []);

  const addNotification = useCallback(
    (notification: Omit<OfflineNotification, "id" | "timestamp">): string => {
      const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fullNotification: OfflineNotification = {
        ...notification,
        id,
        timestamp: Date.now(),
      };

      dispatch({ type: "ADD_NOTIFICATION", payload: fullNotification });

      // Auto-remove non-persistent notifications after 5 seconds
      if (!notification.persistent) {
        const timeout = setTimeout(() => {
          removeNotification(id);
        }, 5000);
        notificationTimeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });

    const timeout = notificationTimeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      notificationTimeoutsRef.current.delete(id);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });

    notificationTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    notificationTimeoutsRef.current.clear();
  }, []);

  // Actions
  const actions = {
    refreshNetworkStatus,

    queueRequest: async (
      request: Parameters<OfflineContextType["actions"]["queueRequest"]>[0]
    ) => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      const requestId = await offlineServiceRef.current.queueRequest(request);
      updateQueueStats();
      return requestId;
    },

    getOfflineService: () => {
      if (!offlineServiceRef.current) {
        console.error("Offline service not available");
        return null;
      }
      return offlineServiceRef.current;
    },
    getQueuedRequests: async () => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      return offlineServiceRef.current.getQueuedRequests();
    },

    clearQueue: async () => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      await offlineServiceRef.current.clearQueue();
      updateQueueStats();
    },

    retryFailedRequests: async () => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      await offlineServiceRef.current.syncPendingRequests();
      updateQueueStats();
    },

    storeOfflineData: async (
      data: Parameters<OfflineContextType["actions"]["storeOfflineData"]>[0]
    ) => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      return offlineServiceRef.current.storeOfflineData(data);
    },

    getOfflineData: async (table: string, id?: string) => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      return offlineServiceRef.current.getOfflineData(table, id);
    },

    updateOfflineData: async (
      id: string,
      data: Parameters<OfflineContextType["actions"]["updateOfflineData"]>[1]
    ) => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      return offlineServiceRef.current.updateOfflineData(id, data);
    },

    deleteOfflineData: async (id: string) => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      return offlineServiceRef.current.deleteOfflineData(id);
    },

    syncNow: async () => {
      if (!offlineServiceRef.current)
        throw new Error("Offline service not initialized");
      const result = await offlineServiceRef.current.syncPendingRequests();
      updateQueueStats();
      return result;
    },

    enableAutoSync: () => {
      if (offlineServiceRef.current) {
        offlineServiceRef.current.updateConfig({ enableBackgroundSync: true });
        dispatch({
          type: "SET_CONFIG",
          payload: offlineServiceRef.current.getConfig(),
        });
      }
    },

    disableAutoSync: () => {
      if (offlineServiceRef.current) {
        offlineServiceRef.current.updateConfig({ enableBackgroundSync: false });
        dispatch({
          type: "SET_CONFIG",
          payload: offlineServiceRef.current.getConfig(),
        });
      }
    },

    updateConfig: (
      config: Parameters<OfflineContextType["actions"]["updateConfig"]>[0]
    ) => {
      if (offlineServiceRef.current) {
        offlineServiceRef.current.updateConfig(config);
        dispatch({
          type: "SET_CONFIG",
          payload: offlineServiceRef.current.getConfig(),
        });
      }
    },

    addNotification,
    removeNotification,
    clearNotifications,

    showOfflineMode: () => {
      dispatch({ type: "SET_OFFLINE_INDICATOR", payload: true });
    },

    hideOfflineMode: () => {
      dispatch({ type: "SET_OFFLINE_INDICATOR", payload: false });
    },

    toggleSyncIndicator: (show: boolean) => {
      dispatch({ type: "SET_SYNC_INDICATOR", payload: show });
    },
  };

  const contextValue: OfflineContextType = {
    state,
    actions,
    offlineService: offlineServiceRef.current as OfflineService,
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};

export default OfflineContext;
