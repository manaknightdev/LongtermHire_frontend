import { OfflineContextState, OfflineAction } from "./types";

export const initialState: OfflineContextState = {
  networkStatus: {
    isOnline: navigator.onLine,
    isSlowConnection: false,
    lastOnlineTime: navigator.onLine ? Date.now() : undefined,
    lastOfflineTime: !navigator.onLine ? Date.now() : undefined,
  },
  isOnline: navigator.onLine,
  isOffline: !navigator.onLine,
  syncStatus: {
    isSyncing: false,
    pendingRequests: 0,
    failedRequests: 0,
    syncErrors: [],
  },
  config: {
    enableOfflineMode: true,
    maxRetries: 3,
    retryDelay: 1000,
    maxQueueSize: 100,
    syncInterval: 30000,
    enableOptimisticUpdates: true,
    enableBackgroundSync: true,
    storageQuota: 50,
    enableNotifications: true,
  },
  queueStats: {
    total: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byOperation: { create: 0, update: 0, delete: 0, custom: 0 },
  },
  showOfflineIndicator: false,
  showSyncIndicator: false,
  notifications: [],
};

export const offlineReducer = (
  state: OfflineContextState,
  action: OfflineAction
): OfflineContextState => {
  switch (action.type) {
    case "SET_NETWORK_STATUS":
      return {
        ...state,
        networkStatus: action.payload,
        isOnline: action.payload.isOnline,
        isOffline: !action.payload.isOnline,
        showOfflineIndicator: !action.payload.isOnline,
      };

    case "SET_SYNC_STATUS":
      return {
        ...state,
        syncStatus: action.payload,
      };

    case "SET_CONFIG":
      return {
        ...state,
        config: action.payload,
      };

    case "SET_QUEUE_STATS":
      return {
        ...state,
        queueStats: action.payload,
      };

    case "SET_OFFLINE_INDICATOR":
      return {
        ...state,
        showOfflineIndicator: action.payload,
      };

    case "SET_SYNC_INDICATOR":
      return {
        ...state,
        showSyncIndicator: action.payload,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };

    case "UPDATE_STATE":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
