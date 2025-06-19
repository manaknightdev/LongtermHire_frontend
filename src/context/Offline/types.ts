import { OfflineService } from "@/utils";
import {
  NetworkStatus,
  SyncStatus,
  OfflineConfig,
  OfflineRequest,
  OfflineData,
} from "@/utils/offline/types";

export interface OfflineContextState {
  // Network status
  networkStatus: NetworkStatus;
  isOnline: boolean;
  isOffline: boolean;

  // Sync status
  syncStatus: SyncStatus;

  // Configuration
  config: OfflineConfig;

  // Queue information
  queueStats: {
    total: number;
    byPriority: Record<string, number>;
    byOperation: Record<string, number>;
    oldestTimestamp?: number;
  };

  // UI state
  showOfflineIndicator: boolean;
  showSyncIndicator: boolean;
  notifications: OfflineNotification[];
}

export interface OfflineNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  timestamp: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface OfflineContextActions {
  // Network actions
  refreshNetworkStatus: () => void;

  getOfflineService: () => OfflineService | null;

  // Queue actions
  queueRequest: (
    request: Omit<OfflineRequest, "id" | "timestamp" | "retryCount">
  ) => Promise<string>;
  getQueuedRequests: () => Promise<OfflineRequest[]>;
  clearQueue: () => Promise<void>;
  retryFailedRequests: () => Promise<void>;

  // Data actions
  storeOfflineData: (
    data: Omit<OfflineData, "id" | "timestamp">
  ) => Promise<string>;
  getOfflineData: (table: string, id?: string) => Promise<OfflineData[]>;
  updateOfflineData: (id: string, data: Partial<OfflineData>) => Promise<void>;
  deleteOfflineData: (id: string) => Promise<void>;

  // Sync actions
  syncNow: () => Promise<{ success: number; failed: number }>;
  enableAutoSync: () => void;
  disableAutoSync: () => void;

  // Configuration actions
  updateConfig: (config: Partial<OfflineConfig>) => void;

  // Notification actions
  addNotification: (
    notification: Omit<OfflineNotification, "id" | "timestamp">
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // UI actions
  showOfflineMode: () => void;
  hideOfflineMode: () => void;
  toggleSyncIndicator: (show: boolean) => void;
}

export interface OfflineContextType {
  state: OfflineContextState;
  actions: OfflineContextActions;
  offlineService: OfflineService;
}

export type OfflineAction =
  | { type: "SET_NETWORK_STATUS"; payload: NetworkStatus }
  | { type: "SET_SYNC_STATUS"; payload: SyncStatus }
  | { type: "SET_CONFIG"; payload: OfflineConfig }
  | { type: "SET_QUEUE_STATS"; payload: OfflineContextState["queueStats"] }
  | { type: "SET_OFFLINE_INDICATOR"; payload: boolean }
  | { type: "SET_SYNC_INDICATOR"; payload: boolean }
  | { type: "ADD_NOTIFICATION"; payload: OfflineNotification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "UPDATE_STATE"; payload: Partial<OfflineContextState> };

export interface OfflineProviderProps {
  children: React.ReactNode;
  config?: Partial<OfflineConfig>;
  enableNotifications?: boolean;
  enableAutoSync?: boolean;
}
