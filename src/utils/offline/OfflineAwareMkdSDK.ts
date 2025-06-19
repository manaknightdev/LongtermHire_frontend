import MkdSDK, { MethodConfig } from "../MkdSDK";
import { RestAPIMethodEnum } from "../Enums";
import { OfflineSDKMixin } from "./OfflineSDKMixin";
import { OfflineService } from "./OfflineService";

// Types that should be exported from MkdSDK but aren't
interface MkdSDKConfig {
  baseurl?: string;
  fe_baseurl?: string;
  project_id?: string;
  secret?: string;
  table?: string;
  GOOGLE_CAPTCHA_SITEKEY?: string;
}

interface MkdAPIResponse {
  status?: number;
  message?: string;
  data?: any;
  list?: any;
  model?: any;
  error?: boolean;
  offline?: boolean;
  _offline?: boolean;
}

/**
 * Enhanced MkdSDK with offline capabilities
 */
export class OfflineAwareMkdSDK extends MkdSDK {
  private offlineMixin: OfflineSDKMixin;

  constructor(config: MkdSDKConfig = {}, offlineService?: OfflineService) {
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
   *
   * Construct endpoint with project and role
   */
  constructEndpoint(template: string): string {
    return `${this.getBaseUrl()}${template
      .replace(/{{project}}/g, this.getProjectId())
      .replace(/{{role}}/g, this.getRole())}`;
  }

  /**
   * Enhanced request method with offline support
   */
  async request(config: MethodConfig): Promise<MkdAPIResponse> {
    const originalRequest = () => super.request(config);

    // Determine operation type based on method and endpoint
    const operation = this.getOperationType(
      config.method || "GET",
      config.endpoint
    );

    const offlineRequestData = {
      endpoint: this.constructEndpoint(config.endpoint),
      method: config.method || "GET",
      body: config.body,
      headers: this.getHeader(config.additionalHeaders, ["Content-Type"]),
      table: this.extractTableFromEndpoint(config.endpoint),
      operation,
      priority: this.getPriorityFromOperation(operation),
      metadata: {
        originalConfig: config,
      },
    };

    return this.offlineMixin["requestWithOfflineSupport"](
      originalRequest,
      offlineRequestData
    );
  }

  /**
   * Enhanced create method with offline support
   */
  async create(table: string, payload: any): Promise<MkdAPIResponse> {
    this.setTable(table);
    const originalRequest = () =>
      super.callRestAPI(payload, RestAPIMethodEnum.POST);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}`),
      method: "POST",
      body: payload,
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
  async update(
    table: string,
    id: string | number,
    payload: any
  ): Promise<MkdAPIResponse> {
    this.setTable(table);
    const originalRequest = () =>
      super.callRestAPI({ ...payload, id }, RestAPIMethodEnum.PUT);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}/${id}`),
      method: "PUT",
      body: payload,
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
  async delete(table: string, id: string | number): Promise<MkdAPIResponse> {
    this.setTable(table);
    const originalRequest = () =>
      super.callRestAPI({ id }, RestAPIMethodEnum.DELETE);

    const offlineRequestData = {
      endpoint: this.constructEndpoint(`/{{project}}/{{role}}/${table}/${id}`),
      method: "DELETE",
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
  async getList(table: string, payload: any = {}): Promise<MkdAPIResponse> {
    try {
      // Try to get online data first
      this.setTable(table);
      const onlineResult = await super.callRestAPI(
        payload,
        RestAPIMethodEnum.GETALL
      );

      // Merge with offline data if available
      if (onlineResult.list) {
        const mergedData = await this.offlineMixin["mergeOnlineOfflineData"](
          table,
          onlineResult.list,
          true
        );

        return {
          ...onlineResult,
          list: mergedData,
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
          _offline: true,
        };
      }
      throw error;
    }
  }

  /**
   * Enhanced getOne method with offline data support
   */
  async getOne(table: string, id: string | number): Promise<MkdAPIResponse> {
    try {
      this.setTable(table);
      return await super.callRestAPI({ id }, RestAPIMethodEnum.GET);
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
          };
        }
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

  // Helper methods
  private getOperationType(
    method: string,
    _endpoint: string
  ): "create" | "update" | "delete" | "custom" {
    switch (method.toUpperCase()) {
      case "POST":
        return "create";
      case "PUT":
      case "PATCH":
        return "update";
      case "DELETE":
        return "delete";
      default:
        return "custom";
    }
  }

  private extractTableFromEndpoint(endpoint: string): string | undefined {
    // Extract table name from endpoint pattern like /{{project}}/{{role}}/tablename
    const match = endpoint.match(
      /\/v1\/api\/\{\{project\}\}\/\{\{role\}\}\/([^\/\?]+)/
    );
    return match ? match[1] : undefined;
  }

  private getPriorityFromOperation(
    operation: string
  ): "high" | "medium" | "low" {
    switch (operation) {
      case "create":
      case "update":
      case "delete":
        return "high";
      default:
        return "medium";
    }
  }
}
