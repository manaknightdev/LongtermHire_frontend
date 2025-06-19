// Offline Service Types

export interface OfflineRequest {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  body?: any;
  headers?: Record<string, string>;
  table?: string;
  operation: 'create' | 'update' | 'delete' | 'custom';
  retryCount: number;
  maxRetries: number;
  priority: 'high' | 'medium' | 'low';
  metadata?: {
    optimisticId?: string;
    originalData?: any;
    [key: string]: any;
  };
}

export interface OfflineData {
  id: string;
  table: string;
  data: any;
  timestamp: number;
  operation: 'create' | 'update' | 'delete';
  synced: boolean;
  optimisticId?: string;
  serverData?: any;
}

export interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
  lastOnlineTime?: number;
  lastOfflineTime?: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  pendingRequests: number;
  failedRequests: number;
  lastSyncTime?: number;
  syncErrors: Array<{
    requestId: string;
    error: string;
    timestamp: number;
  }>;
}

export interface OfflineConfig {
  enableOfflineMode: boolean;
  maxRetries: number;
  retryDelay: number;
  maxQueueSize: number;
  syncInterval: number;
  enableOptimisticUpdates: boolean;
  enableBackgroundSync: boolean;
  storageQuota: number; // in MB
  enableNotifications: boolean;
}

export interface OfflineServiceEvents {
  'network-status-changed': NetworkStatus;
  'sync-started': void;
  'sync-completed': { success: number; failed: number };
  'sync-failed': { error: string };
  'request-queued': OfflineRequest;
  'request-synced': { requestId: string; success: boolean };
  'storage-quota-exceeded': { currentUsage: number; quota: number };
  'offline-data-updated': { table: string; operation: string; data: any };
}

export type OfflineServiceEventListener<T extends keyof OfflineServiceEvents> = (
  data: OfflineServiceEvents[T]
) => void;

export interface OfflineServiceInterface {
  // Network status
  getNetworkStatus(): NetworkStatus;
  isOnline(): boolean;
  
  // Request queue management
  queueRequest(request: Omit<OfflineRequest, 'id' | 'timestamp' | 'retryCount'>): Promise<string>;
  getQueuedRequests(): Promise<OfflineRequest[]>;
  clearQueue(): Promise<void>;
  
  // Data management
  storeOfflineData(data: Omit<OfflineData, 'id' | 'timestamp'>): Promise<string>;
  getOfflineData(table: string, id?: string): Promise<OfflineData[]>;
  updateOfflineData(id: string, data: Partial<OfflineData>): Promise<void>;
  deleteOfflineData(id: string): Promise<void>;
  
  // Sync operations
  syncPendingRequests(): Promise<{ success: number; failed: number }>;
  getSyncStatus(): SyncStatus;
  
  // Configuration
  updateConfig(config: Partial<OfflineConfig>): void;
  getConfig(): OfflineConfig;
  
  // Event handling
  on<T extends keyof OfflineServiceEvents>(
    event: T,
    listener: OfflineServiceEventListener<T>
  ): void;
  off<T extends keyof OfflineServiceEvents>(
    event: T,
    listener: OfflineServiceEventListener<T>
  ): void;
  
  // Lifecycle
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

export interface StorageManagerInterface {
  // Database operations
  initialize(): Promise<void>;
  clear(): Promise<void>;
  
  // Request queue operations
  addRequest(request: OfflineRequest): Promise<string>;
  getRequests(): Promise<OfflineRequest[]>;
  updateRequest(id: string, updates: Partial<OfflineRequest>): Promise<void>;
  deleteRequest(id: string): Promise<void>;
  
  // Offline data operations
  addData(data: OfflineData): Promise<string>;
  getData(table: string, id?: string): Promise<OfflineData[]>;
  updateData(id: string, updates: Partial<OfflineData>): Promise<void>;
  deleteData(id: string): Promise<void>;
  
  // Utility operations
  getStorageUsage(): Promise<number>;
  cleanup(olderThan: number): Promise<void>;
}
