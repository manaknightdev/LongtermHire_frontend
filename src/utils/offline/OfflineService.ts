import {
  OfflineRequest,
  OfflineData,
  NetworkStatus,
  SyncStatus,
  OfflineConfig,
  OfflineServiceInterface,
  OfflineServiceEvents,
  OfflineServiceEventListener,
} from "./types";
import { OfflineStorageManager } from "./OfflineStorageManager";
import { RequestQueue } from "./RequestQueue";

/**
 * Main offline service that coordinates network detection, data storage, and sync operations
 */
export class OfflineService implements OfflineServiceInterface {
  private storageManager: OfflineStorageManager;
  private requestQueue: RequestQueue;
  private networkStatus: NetworkStatus;
  private syncStatus: SyncStatus;
  private config: OfflineConfig;
  private eventListeners: Map<keyof OfflineServiceEvents, Set<Function>> =
    new Map();
  private syncInterval?: number;
  private networkCheckInterval?: number;
  private isInitialized = false;

  constructor(config?: Partial<OfflineConfig>) {
    this.config = {
      enableOfflineMode: true,
      maxRetries: 3,
      retryDelay: 1000,
      maxQueueSize: 100,
      syncInterval: 30000, // 30 seconds
      enableOptimisticUpdates: true,
      enableBackgroundSync: true,
      storageQuota: 50, // 50MB
      enableNotifications: true,
      ...config,
    };

    this.storageManager = new OfflineStorageManager();
    this.requestQueue = new RequestQueue(this.storageManager, this.config);

    this.networkStatus = {
      isOnline: navigator.onLine,
      isSlowConnection: false,
      connectionType: this.getConnectionType(),
      lastOnlineTime: navigator.onLine ? Date.now() : undefined,
      lastOfflineTime: !navigator.onLine ? Date.now() : undefined,
    };

    this.syncStatus = {
      isSyncing: false,
      pendingRequests: 0,
      failedRequests: 0,
      syncErrors: [],
    };

    this.setupNetworkListeners();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.storageManager.initialize();
      await this.updateSyncStatus();

      if (this.config.enableBackgroundSync && this.networkStatus.isOnline) {
        this.startSyncInterval();
      }

      this.startNetworkMonitoring();
      this.isInitialized = true;

      console.log("OfflineService initialized successfully");
    } catch (error) {
      console.error("Failed to initialize OfflineService:", error);
      throw error;
    }
  }

  async destroy(): Promise<void> {
    this.stopSyncInterval();
    this.stopNetworkMonitoring();
    this.eventListeners.clear();
    this.isInitialized = false;
  }

  // Network status methods
  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  isOnline(): boolean {
    return this.networkStatus.isOnline;
  }

  // Request queue methods
  async queueRequest(
    request: Omit<OfflineRequest, "id" | "timestamp" | "retryCount">
  ): Promise<string> {
    if (!this.config.enableOfflineMode) {
      throw new Error("Offline mode is disabled");
    }

    const requestId = await this.requestQueue.enqueue(request);
    await this.updateSyncStatus();

    this.emit("request-queued", {
      ...request,
      id: requestId,
      timestamp: Date.now(),
      retryCount: 0,
    } as OfflineRequest);

    // Try immediate sync if online
    if (this.networkStatus.isOnline) {
      this.syncPendingRequests();
    }

    return requestId;
  }

  async getQueuedRequests(): Promise<OfflineRequest[]> {
    return this.requestQueue.getAll();
  }

  async clearQueue(): Promise<void> {
    await this.requestQueue.clear();
    await this.updateSyncStatus();
  }

  // Data management methods
  async storeOfflineData(
    data: Omit<OfflineData, "id" | "timestamp">
  ): Promise<string> {
    const offlineData: OfflineData = {
      ...data,
      id: this.generateDataId(),
      timestamp: Date.now(),
    };

    const dataId = await this.storageManager.addData(offlineData);
    this.emit("offline-data-updated", {
      table: data.table,
      operation: data.operation,
      data: data.data,
    });

    return dataId;
  }

  async getOfflineData(table: string, id?: string): Promise<OfflineData[]> {
    return this.storageManager.getData(table, id);
  }

  async updateOfflineData(
    id: string,
    data: Partial<OfflineData>
  ): Promise<void> {
    await this.storageManager.updateData(id, data);

    if (data.table && data.operation && data.data) {
      this.emit("offline-data-updated", {
        table: data.table,
        operation: data.operation,
        data: data.data,
      });
    }
  }

  async deleteOfflineData(id: string): Promise<void> {
    await this.storageManager.deleteData(id);
  }

  // Sync operations
  async syncPendingRequests(): Promise<{ success: number; failed: number }> {
    if (!this.networkStatus.isOnline || this.syncStatus.isSyncing) {
      return { success: 0, failed: 0 };
    }

    this.syncStatus.isSyncing = true;
    this.emit("sync-started", undefined);

    try {
      const result = await this.requestQueue.processQueue();

      this.syncStatus.lastSyncTime = Date.now();
      this.syncStatus.isSyncing = false;

      await this.updateSyncStatus();

      this.emit("sync-completed", result);
      return result;
    } catch (error) {
      this.syncStatus.isSyncing = false;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown sync error";

      this.syncStatus.syncErrors.push({
        requestId: "sync-operation",
        error: errorMessage,
        timestamp: Date.now(),
      });

      this.emit("sync-failed", { error: errorMessage });
      throw error;
    }
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Configuration
  updateConfig(config: Partial<OfflineConfig>): void {
    this.config = { ...this.config, ...config };
    this.requestQueue.updateConfig(this.config);

    if (config.syncInterval !== undefined) {
      this.stopSyncInterval();
      if (this.config.enableBackgroundSync && this.networkStatus.isOnline) {
        this.startSyncInterval();
      }
    }
  }

  getConfig(): OfflineConfig {
    return { ...this.config };
  }

  // Event handling
  on<T extends keyof OfflineServiceEvents>(
    event: T,
    listener: OfflineServiceEventListener<T>
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(listener);
  }

  off<T extends keyof OfflineServiceEvents>(
    event: T,
    listener: OfflineServiceEventListener<T>
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private emit<T extends keyof OfflineServiceEvents>(
    event: T,
    data: OfflineServiceEvents[T]
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Private helper methods
  private setupNetworkListeners(): void {
    window.addEventListener("online", this.handleOnline.bind(this));
    window.addEventListener("offline", this.handleOffline.bind(this));
  }

  public async handleOnline(): Promise<void> {
    const wasOffline = !this.networkStatus.isOnline;

    this.networkStatus.isOnline = true;
    this.networkStatus.lastOnlineTime = Date.now();
    this.networkStatus.connectionType = this.getConnectionType();

    this.emit("network-status-changed", this.getNetworkStatus());

    if (wasOffline && this.config.enableBackgroundSync) {
      this.startSyncInterval();
      // Immediate sync when coming back online
      setTimeout(() => this.syncPendingRequests(), 1000);
    }
  }

  public handleOffline(): void {
    this.networkStatus.isOnline = false;
    this.networkStatus.lastOfflineTime = Date.now();

    this.stopSyncInterval();
    this.emit("network-status-changed", this.getNetworkStatus());
  }

  private getConnectionType(): string | undefined {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    return connection?.effectiveType || connection?.type;
  }

  private startSyncInterval(): void {
    if (this.syncInterval) return;

    this.syncInterval = setInterval(() => {
      if (this.networkStatus.isOnline && !this.syncStatus.isSyncing) {
        this.syncPendingRequests().catch((error) => {
          console.error("Background sync failed:", error);
        });
      }
    }, this.config.syncInterval);
  }

  private stopSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  private startNetworkMonitoring(): void {
    this.networkCheckInterval = setInterval(() => {
      const currentOnlineStatus = navigator.onLine;
      if (currentOnlineStatus !== this.networkStatus.isOnline) {
        if (currentOnlineStatus) {
          this.handleOnline();
        } else {
          this.handleOffline();
        }
      }
    }, 5000); // Check every 5 seconds
  }

  private stopNetworkMonitoring(): void {
    if (this.networkCheckInterval) {
      clearInterval(this.networkCheckInterval);
      this.networkCheckInterval = undefined;
    }
  }

  private async updateSyncStatus(): Promise<void> {
    const requests = await this.requestQueue.getAll();
    const stats = await this.requestQueue.getStats();

    this.syncStatus.pendingRequests = stats.total;
    this.syncStatus.failedRequests = requests.filter(
      (r) => r.retryCount > 0
    ).length;
  }

  private generateDataId(): string {
    return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
