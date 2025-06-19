import { OfflineRequest, OfflineConfig } from "./types";
import { OfflineStorageManager } from "./OfflineStorageManager";

/**
 * Request queue manager for handling offline requests
 */
export class RequestQueue {
  private storageManager: OfflineStorageManager;
  private config: OfflineConfig;
  private isProcessing = false;
  private retryTimeouts = new Map<string, number>();

  constructor(storageManager: OfflineStorageManager, config: OfflineConfig) {
    this.storageManager = storageManager;
    this.config = config;
  }

  /**
   * Add a request to the queue
   */
  async enqueue(
    request: Omit<OfflineRequest, "id" | "timestamp" | "retryCount">
  ): Promise<string> {
    const queuedRequest: OfflineRequest = {
      ...request,
      id: this.generateRequestId(),
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: request.maxRetries || this.config.maxRetries,
    };

    // Check queue size limit
    const existingRequests = await this.storageManager.getRequests();
    if (existingRequests.length >= this.config.maxQueueSize) {
      // Remove oldest low-priority request
      const oldestLowPriority = existingRequests
        .filter((r) => r.priority === "low")
        .sort((a, b) => a.timestamp - b.timestamp)[0];

      if (oldestLowPriority) {
        await this.storageManager.deleteRequest(oldestLowPriority.id);
      } else {
        throw new Error("Request queue is full");
      }
    }

    await this.storageManager.addRequest(queuedRequest);
    return queuedRequest.id;
  }

  /**
   * Get all queued requests
   */
  async getAll(): Promise<OfflineRequest[]> {
    return this.storageManager.getRequests();
  }

  /**
   * Process the queue and attempt to sync requests
   */
  async processQueue(): Promise<{ success: number; failed: number }> {
    if (this.isProcessing) {
      return { success: 0, failed: 0 };
    }

    this.isProcessing = true;
    let successCount = 0;
    let failedCount = 0;

    try {
      const requests = await this.storageManager.getRequests();
      console.log("Requests >>", requests);

      for (const request of requests) {
        try {
          const success = await this.executeRequest(request);
          if (success) {
            await this.storageManager.deleteRequest(request.id);
            successCount++;
            this.clearRetryTimeout(request.id);
          } else {
            await this.handleFailedRequest(request);
            failedCount++;
          }
        } catch (error) {
          console.error("Error processing request:", error);
          await this.handleFailedRequest(request);
          failedCount++;
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Execute a single request
   */
  private async executeRequest(request: OfflineRequest): Promise<boolean> {
    try {
      const response = await fetch(request.endpoint, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...request.headers,
        },
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error(`Failed to execute request ${request.id}:`, error);
      return false;
    }
  }

  /**
   * Handle a failed request (retry or remove)
   */
  private async handleFailedRequest(request: OfflineRequest): Promise<void> {
    const updatedRequest = {
      ...request,
      retryCount: request.retryCount + 1,
    };

    if (updatedRequest.retryCount >= updatedRequest.maxRetries) {
      // Max retries reached, remove from queue
      await this.storageManager.deleteRequest(request.id);
      console.warn(
        `Request ${request.id} removed after ${updatedRequest.retryCount} failed attempts`
      );
    } else {
      // Update retry count and schedule retry
      await this.storageManager.updateRequest(request.id, {
        retryCount: updatedRequest.retryCount,
      });
      this.scheduleRetry(request.id, updatedRequest.retryCount);
    }
  }

  /**
   * Schedule a retry for a failed request
   */
  private scheduleRetry(requestId: string, retryCount: number): void {
    this.clearRetryTimeout(requestId);

    // Exponential backoff: base delay * 2^retryCount
    const delay = this.config.retryDelay * Math.pow(2, retryCount - 1);

    const timeout = setTimeout(async () => {
      try {
        const requests = await this.storageManager.getRequests();
        const request = requests.find((r) => r.id === requestId);

        if (request) {
          const success = await this.executeRequest(request);
          if (success) {
            await this.storageManager.deleteRequest(request.id);
            this.clearRetryTimeout(requestId);
          } else {
            await this.handleFailedRequest(request);
          }
        }
      } catch (error) {
        console.error(`Error during retry for request ${requestId}:`, error);
      }
    }, delay);

    this.retryTimeouts.set(requestId, timeout);
  }

  /**
   * Clear retry timeout for a request
   */
  private clearRetryTimeout(requestId: string): void {
    const timeout = this.retryTimeouts.get(requestId);
    if (timeout) {
      clearTimeout(timeout);
      this.retryTimeouts.delete(requestId);
    }
  }

  /**
   * Clear all queued requests
   */
  async clear(): Promise<void> {
    // Clear all retry timeouts
    this.retryTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.retryTimeouts.clear();

    // Clear storage
    const requests = await this.storageManager.getRequests();
    await Promise.all(
      requests.map((request) => this.storageManager.deleteRequest(request.id))
    );
  }

  /**
   * Remove a specific request from the queue
   */
  async remove(requestId: string): Promise<void> {
    this.clearRetryTimeout(requestId);
    await this.storageManager.deleteRequest(requestId);
  }

  /**
   * Get queue statistics
   */
  async getStats(): Promise<{
    total: number;
    byPriority: Record<string, number>;
    byOperation: Record<string, number>;
    oldestTimestamp?: number;
  }> {
    const requests = await this.storageManager.getRequests();

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

    return stats;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<OfflineConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup old requests
   */
  async cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoffTime = Date.now() - maxAge;
    const requests = await this.storageManager.getRequests();

    const oldRequests = requests.filter(
      (request) => request.timestamp < cutoffTime
    );

    await Promise.all(
      oldRequests.map((request) => {
        this.clearRetryTimeout(request.id);
        return this.storageManager.deleteRequest(request.id);
      })
    );
  }
}
