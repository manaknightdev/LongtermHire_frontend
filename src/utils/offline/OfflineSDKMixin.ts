import { OfflineService } from "./OfflineService";
import { OfflineRequest, OfflineData } from "./types";

/**
 * Mixin to add offline capabilities to SDK classes
 */
export class OfflineSDKMixin {
  private offlineService?: OfflineService;
  private enableOfflineMode: boolean = true;

  /**
   * Initialize offline capabilities
   */
  protected initializeOffline(offlineService?: OfflineService): void {
    this.offlineService = offlineService;
  }

  /**
   * Set offline service instance
   */
  setOfflineService(offlineService: OfflineService): void {
    this.offlineService = offlineService;
  }

  /**
   * Enable or disable offline mode
   */
  setOfflineMode(enabled: boolean): void {
    this.enableOfflineMode = enabled;
  }

  /**
   * Check if offline mode is enabled and available
   */
  protected isOfflineModeAvailable(): boolean {
    return this.enableOfflineMode && !!this.offlineService;
  }

  /**
   * Enhanced request method with offline support
   */
  protected async requestWithOfflineSupport(
    originalRequest: () => Promise<any>,
    offlineRequestData: {
      endpoint: string;
      method: string;
      body?: any;
      headers?: any;
      table?: string;
      operation: "create" | "update" | "delete" | "custom";
      priority?: "high" | "medium" | "low";
      metadata?: any;
    }
  ): Promise<any> {
    // If offline mode is not available, use original request
    if (!this.isOfflineModeAvailable()) {
      return originalRequest();
    }

    const isOnline = this.offlineService!.isOnline();
    // Convert Headers object to plain object if necessary
    let safeRequest = { ...offlineRequestData };
    if (
      safeRequest.headers &&
      typeof safeRequest.headers === "object" &&
      safeRequest.headers instanceof Headers
    ) {
      // Convert Headers to plain object
      const headersObj: Record<string, string> = {};
      (safeRequest.headers as Headers).forEach((value, key) => {
        headersObj[key] = value;
      });
      safeRequest.headers = headersObj;
    }

    try {
      if (isOnline) {
        // Try online request first
        return await originalRequest();
      } else {
        // We're offline, queue the request

        return this.handleOfflineRequest(safeRequest);
      }
    } catch (error) {
      // If online request fails, check if it's a network error
      if (this.isNetworkError(error) && this.isOfflineModeAvailable()) {
        console.warn(
          "Network error detected, falling back to offline mode:",
          error
        );
        return this.handleOfflineRequest(safeRequest);
      }
      throw error;
    }
  }

  /**
   * Handle offline request by queuing it
   */
  private async handleOfflineRequest(requestData: {
    endpoint: string;
    method: string;
    body?: any;
    headers?: Record<string, string>;
    table?: string;
    operation: "create" | "update" | "delete" | "custom";
    priority?: "high" | "medium" | "low";
    metadata?: any;
  }): Promise<any> {
    if (!this.offlineService) {
      throw new Error("Offline service not available");
    }

    const offlineRequest: Omit<
      OfflineRequest,
      "id" | "timestamp" | "retryCount"
    > = {
      endpoint: requestData.endpoint,
      method: requestData.method,
      body: requestData.body,
      headers: requestData.headers,
      table: requestData.table,
      operation: requestData.operation,
      priority: requestData.priority || "medium",
      maxRetries: 3,
      metadata: requestData.metadata,
    };

    const requestId = await this.offlineService.queueRequest(offlineRequest);

    // For create operations, generate optimistic response
    if (requestData.operation === "create") {
      return this.generateOptimisticCreateResponse(requestData, requestId);
    }

    // For update operations, return optimistic success
    if (requestData.operation === "update") {
      return this.generateOptimisticUpdateResponse(requestData, requestId);
    }

    // For delete operations, return optimistic success
    if (requestData.operation === "delete") {
      return this.generateOptimisticDeleteResponse(requestData, requestId);
    }

    // For custom operations, return queued response
    return {
      success: true,
      message: "Request queued for sync when online",
      requestId,
      offline: true,
    };
  }

  /**
   * Store data locally for offline access
   */
  protected async storeOfflineData(
    table: string,
    data: any,
    operation: "create" | "update" | "delete",
    optimisticId?: string
  ): Promise<string> {
    if (!this.offlineService) {
      throw new Error("Offline service not available");
    }

    const offlineData: Omit<OfflineData, "id" | "timestamp"> = {
      table,
      data,
      operation,
      synced: false,
      optimisticId,
    };

    return this.offlineService.storeOfflineData(offlineData);
  }

  /**
   * Get offline data for a table
   */
  protected async getOfflineData(
    table: string,
    id?: string
  ): Promise<OfflineData[]> {
    if (!this.offlineService) {
      return [];
    }

    return this.offlineService.getOfflineData(table, id);
  }

  /**
   * Merge online and offline data
   */
  protected async mergeOnlineOfflineData(
    table: string,
    onlineData: any[],
    includeUnsynced: boolean = true
  ): Promise<any[]> {
    if (!this.isOfflineModeAvailable()) {
      return onlineData;
    }

    const offlineData = await this.getOfflineData(table);

    if (!includeUnsynced) {
      return onlineData;
    }

    // Add unsynced offline data
    const unsyncedData = offlineData
      .filter((item) => !item.synced && item.operation !== "delete")
      .map((item) => ({
        ...item.data,
        _offline: true,
        _optimisticId: item.optimisticId,
      }));

    return [...onlineData, ...unsyncedData];
  }

  /**
   * Check if an error is a network error
   */
  private isNetworkError(error: any): boolean {
    if (!error) return false;

    // Check for common network error indicators
    const networkErrorMessages = [
      "network error",
      "fetch error",
      "connection failed",
      "timeout",
      "no internet",
      "offline",
    ];

    const errorMessage = (error.message || error.toString()).toLowerCase();
    return (
      networkErrorMessages.some((msg) => errorMessage.includes(msg)) ||
      error.name === "TypeError" ||
      error.code === "NETWORK_ERROR"
    );
  }

  /**
   * Generate optimistic response for create operations
   */
  private generateOptimisticCreateResponse(
    requestData: any,
    requestId: string
  ): any {
    const optimisticId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      data: {
        ...requestData.body,
        id: optimisticId,
        _offline: true,
        _requestId: requestId,
      },
      message: "Created locally, will sync when online",
      offline: true,
      requestId,
    };
  }

  /**
   * Generate optimistic response for update operations
   */
  private generateOptimisticUpdateResponse(
    requestData: any,
    requestId: string
  ): any {
    return {
      success: true,
      data: requestData.body,
      message: "Updated locally, will sync when online",
      offline: true,
      requestId,
    };
  }

  /**
   * Generate optimistic response for delete operations
   */
  private generateOptimisticDeleteResponse(
    _requestData: any,
    requestId: string
  ): any {
    return {
      success: true,
      message: "Deleted locally, will sync when online",
      offline: true,
      requestId,
    };
  }

  /**
   * Check if we should use cached data
   */
  protected shouldUseCachedData(): boolean {
    if (!this.isOfflineModeAvailable()) {
      return false;
    }

    const networkStatus = this.offlineService!.getNetworkStatus();
    return !networkStatus.isOnline || networkStatus.isSlowConnection;
  }

  /**
   * Get sync status for debugging
   */
  getSyncStatus() {
    if (!this.offlineService) {
      return null;
    }
    return this.offlineService.getSyncStatus();
  }

  /**
   * Force sync pending requests
   */
  async forcSync(): Promise<{ success: number; failed: number }> {
    if (!this.offlineService) {
      throw new Error("Offline service not available");
    }
    return this.offlineService.syncPendingRequests();
  }
}
