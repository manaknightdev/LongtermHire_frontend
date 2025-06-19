import TreeSDK, {
  TreeSDKConfig,
  TreeSDKOptions,
  ApiResponse,
} from "../TreeSDK";
import { OfflineSDKMixin } from "./OfflineSDKMixin";
import { OfflineService } from "./OfflineService";

/**
 * Enhanced TreeSDK with offline capabilities
 */
export class OfflineAwareTreeSDK extends TreeSDK {
  private offlineMixin: OfflineSDKMixin;

  constructor(config: TreeSDKConfig = {}, offlineService?: OfflineService) {
    super(config);
    this.offlineMixin = new OfflineSDKMixin();
    if (offlineService) {
      this.offlineMixin.setOfflineService(offlineService);
    }
  }

  /**
   * Set offline service
   */
  setOfflineService(offlineService: OfflineService): void {
    this.offlineMixin.setOfflineService(offlineService);
  }

  /**
   * Enable/disable offline mode
   */
  setOfflineMode(enabled: boolean): void {
    this.offlineMixin.setOfflineMode(enabled);
  }

  /**
   * Construct endpoint with project and role
   */
  constructEndpoint(template: string): string {
    return `${this.treeBaseUrl()}${template
      .replace(/{{project}}/g, this.getProjectId())
      .replace(/{{role}}/g, this.getRole())}`;
  }
  /**
   * Enhanced create method with offline support
   */
  async create<T = any>(
    table: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const originalRequest = () => super.create<T>(table, payload);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}`),
      method: "POST",
      body: payload,
      headers: this.getHeader(null, ["Content-Type"]),
      table,
      operation: "create" as const,
      priority: "high" as const,
      metadata: { table, payload },
    };

    const result = await this.offlineMixin["requestWithOfflineSupport"](
      originalRequest,
      offlineRequestData
    );

    // Store data locally if offline
    if (result.offline && result.data) {
      await this.offlineMixin["storeOfflineData"](
        table,
        result.data,
        "create",
        result.data.id
      );
    }

    return result;
  }

  /**
   * Enhanced update method with offline support
   */
  async update<T = any>(
    table: string,
    id: number | string,
    payload: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const originalRequest = () => super.update<T>(table, id, payload);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}/${id}`),
      method: "PUT",
      body: payload,
      headers: this.getHeader(null, ["Content-Type"]),
      table,
      operation: "update" as const,
      priority: "high" as const,
      metadata: { table, id, payload },
    };

    const result = await this.offlineMixin["requestWithOfflineSupport"](
      originalRequest,
      offlineRequestData
    );

    // Store data locally if offline
    if (result.offline) {
      await this.offlineMixin["storeOfflineData"](
        table,
        { ...payload, id },
        "update"
      );
    }

    return result;
  }

  /**
   * Enhanced delete method with offline support
   */
  async delete<T = any>(
    table: string,
    id: number | string
  ): Promise<ApiResponse<T>> {
    const originalRequest = () => super.delete<T>(table, id);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}/${id}`),
      method: "DELETE",
      headers: this.getHeader(null, ["Content-Type"]),
      table,
      operation: "delete" as const,
      priority: "high" as const,
      metadata: { table, id },
    };

    const result = await this.offlineMixin["requestWithOfflineSupport"](
      originalRequest,
      offlineRequestData
    );

    // Store deletion locally if offline
    if (result.offline) {
      await this.offlineMixin["storeOfflineData"](
        table,
        { id, _deleted: true },
        "delete"
      );
    }

    return result;
  }

  /**
   * Enhanced getList method with offline data merging
   */
  async getList<T = any>(
    table: string,
    options: TreeSDKOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Try to get online data first
      const onlineResult = await super.getList<T>(table, options);

      // Merge with offline data if available
      if (onlineResult.list || onlineResult.data) {
        const dataArray = Array.isArray(onlineResult.list)
          ? onlineResult.list
          : Array.isArray(onlineResult.data)
            ? onlineResult.data
            : [];
        const mergedData = await this.offlineMixin["mergeOnlineOfflineData"](
          table,
          dataArray,
          true
        );

        return {
          ...onlineResult,
          list: mergedData,
          data: mergedData,
        };
      }

      return onlineResult;
    } catch (error) {
      // If online request fails and we're offline, return cached data
      if (this.offlineMixin["shouldUseCachedData"]()) {
        const offlineData = await this.offlineMixin["getOfflineData"](table);
        const cachedList = offlineData
          .filter((item) => item.operation !== "delete")
          .map((item) => ({
            ...item.data,
            _offline: true,
            _cached: true,
          }));

        return {
          error: false,
          message: "Showing cached data (offline)",
          list: cachedList,
          data: cachedList,
          total: cachedList.length,
          _offline: true,
        } as ApiResponse<T>;
      }
      throw error;
    }
  }

  /**
   * Enhanced getPaginate method with offline data merging
   */
  async getPaginate<T = any>(
    table: string,
    options: TreeSDKOptions = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    try {
      // Try to get online data first
      const onlineResult = await super.getPaginate<T>(table, options, signal);

      // Merge with offline data if available
      if (onlineResult.list || onlineResult.data) {
        const dataArray = Array.isArray(onlineResult.list)
          ? onlineResult.list
          : Array.isArray(onlineResult.data)
            ? onlineResult.data
            : [];
        const mergedData = await this.offlineMixin["mergeOnlineOfflineData"](
          table,
          dataArray,
          true
        );

        return {
          ...onlineResult,
          list: mergedData,
          data: mergedData,
        };
      }

      return onlineResult;
    } catch (error) {
      // If online request fails and we're offline, return cached data
      if (this.offlineMixin["shouldUseCachedData"]()) {
        const offlineData = await this.offlineMixin["getOfflineData"](table);
        const cachedList = offlineData
          .filter((item) => item.operation !== "delete")
          .map((item) => ({
            ...item.data,
            _offline: true,
            _cached: true,
          }));

        return {
          error: false,
          message: "Showing cached data (offline)",
          list: cachedList,
          data: cachedList,
          total: cachedList.length,
          page: options.page || 1,
          limit: options.size || cachedList.length,
          num_pages: 1,
          _offline: true,
        } as ApiResponse<T>;
      }
      throw error;
    }
  }

  /**
   * Enhanced getOne method with offline data support
   */
  async getOne<T = any>(
    table: string,
    id: number | string,
    options: TreeSDKOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      return await super.getOne<T>(table, id, options);
    } catch (error) {
      // If online request fails, try to get from offline data
      if (this.offlineMixin["shouldUseCachedData"]()) {
        const offlineData = await this.offlineMixin["getOfflineData"](
          table,
          id.toString()
        );

        if (offlineData.length > 0 && offlineData[0].operation !== "delete") {
          return {
            error: false,
            message: "Showing cached data (offline)",
            data: {
              ...offlineData[0].data,
              _offline: true,
              _cached: true,
            },
            model: {
              ...offlineData[0].data,
              _offline: true,
              _cached: true,
            },
          } as ApiResponse<T>;
        }
      }
      throw error;
    }
  }

  /**
   * Enhanced getMany method with offline data support
   */
  async getMany<T = any>(
    table: string,
    ids: number | string | (number | string)[],
    options: TreeSDKOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const onlineResult = await super.getMany<T>(table, ids, options);

      // Merge with offline data if available
      if (onlineResult.list || onlineResult.data) {
        const dataArray = Array.isArray(onlineResult.list)
          ? onlineResult.list
          : Array.isArray(onlineResult.data)
            ? onlineResult.data
            : [];
        const mergedData = await this.offlineMixin["mergeOnlineOfflineData"](
          table,
          dataArray,
          true
        );

        return {
          ...onlineResult,
          list: mergedData,
          data: mergedData,
        };
      }

      return onlineResult;
    } catch (error) {
      // If online request fails, try to get from offline data
      if (this.offlineMixin["shouldUseCachedData"]()) {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const offlineData = await this.offlineMixin["getOfflineData"](table);

        const cachedItems = offlineData
          .filter(
            (item) =>
              item.operation !== "delete" && idsArray.includes(item.data.id)
          )
          .map((item) => ({
            ...item.data,
            _offline: true,
            _cached: true,
          }));

        return {
          error: false,
          message: "Showing cached data (offline)",
          list: cachedItems,
          data: cachedItems,
          total: cachedItems.length,
          _offline: true,
        } as ApiResponse<T>;
      }
      throw error;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return this.offlineMixin.getSyncStatus();
  }

  /**
   * Force sync pending requests
   */
  async forceSync(): Promise<{ success: number; failed: number }> {
    return this.offlineMixin.forcSync();
  }
}
