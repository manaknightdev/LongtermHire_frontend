import { OfflineRequest, OfflineData, StorageManagerInterface } from "./types";

/**
 * IndexedDB-based storage manager for offline data and request queue
 */
export class OfflineStorageManager implements StorageManagerInterface {
  private db: IDBDatabase | null = null;
  private readonly dbName = "MkdOfflineDB";
  private readonly dbVersion = 1;
  private readonly requestStore = "requests";
  private readonly dataStore = "offlineData";

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create request queue store
        if (!db.objectStoreNames.contains(this.requestStore)) {
          const requestStore = db.createObjectStore(this.requestStore, {
            keyPath: "id",
          });
          requestStore.createIndex("timestamp", "timestamp", { unique: false });
          requestStore.createIndex("priority", "priority", { unique: false });
          requestStore.createIndex("operation", "operation", { unique: false });
        }

        // Create offline data store
        if (!db.objectStoreNames.contains(this.dataStore)) {
          const dataStore = db.createObjectStore(this.dataStore, {
            keyPath: "id",
          });
          dataStore.createIndex("table", "table", { unique: false });
          dataStore.createIndex("timestamp", "timestamp", { unique: false });
          dataStore.createIndex("synced", "synced", { unique: false });
          dataStore.createIndex("operation", "operation", { unique: false });
        }
      };
    });
  }

  async clear(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const transaction = this.db.transaction(
      [this.requestStore, this.dataStore],
      "readwrite"
    );

    await Promise.all([
      this.clearStore(transaction.objectStore(this.requestStore)),
      this.clearStore(transaction.objectStore(this.dataStore)),
    ]);
  }

  private clearStore(store: IDBObjectStore): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Request queue operations
  async addRequest(request: OfflineRequest): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.requestStore],
        "readwrite"
      );
      const store = transaction.objectStore(this.requestStore);
      const addRequest = store.add(request);

      addRequest.onsuccess = () => resolve(request.id);
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  async getRequests(): Promise<OfflineRequest[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.requestStore], "readonly");
      const store = transaction.objectStore(this.requestStore);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by priority and timestamp
        const requests = request.result.sort(
          (a: OfflineRequest, b: OfflineRequest) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityDiff =
              priorityOrder[b.priority] - priorityOrder[a.priority];
            return priorityDiff !== 0
              ? priorityDiff
              : a.timestamp - b.timestamp;
          }
        );
        resolve(requests);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateRequest(
    id: string,
    updates: Partial<OfflineRequest>
  ): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.requestStore],
        "readwrite"
      );
      const store = transaction.objectStore(this.requestStore);

      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const existingRequest = getRequest.result;
        if (!existingRequest) {
          reject(new Error("Request not found"));
          return;
        }

        const updatedRequest = { ...existingRequest, ...updates };
        const putRequest = store.put(updatedRequest);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteRequest(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        [this.requestStore],
        "readwrite"
      );
      const store = transaction.objectStore(this.requestStore);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Offline data operations
  async addData(data: OfflineData): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.dataStore], "readwrite");
      const store = transaction.objectStore(this.dataStore);
      const request = store.add(data);

      request.onsuccess = () => resolve(data.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getData(table: string, id?: string): Promise<OfflineData[]> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.dataStore], "readonly");
      const store = transaction.objectStore(this.dataStore);

      if (id) {
        const request = store.get(id);
        request.onsuccess = () => {
          const result = request.result;
          resolve(result && result.table === table ? [result] : []);
        };
        request.onerror = () => reject(request.error);
      } else {
        const index = store.index("table");
        const request = index.getAll(table);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    });
  }

  async updateData(id: string, updates: Partial<OfflineData>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.dataStore], "readwrite");
      const store = transaction.objectStore(this.dataStore);

      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const existingData = getRequest.result;
        if (!existingData) {
          reject(new Error("Data not found"));
          return;
        }

        const updatedData = { ...existingData, ...updates };
        const putRequest = store.put(updatedData);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteData(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.dataStore], "readwrite");
      const store = transaction.objectStore(this.dataStore);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageUsage(): Promise<number> {
    if (!navigator.storage || !navigator.storage.estimate) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    } catch (error) {
      console.warn("Failed to get storage usage:", error);
      return 0;
    }
  }

  async cleanup(olderThan: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const cutoffTime = Date.now() - olderThan;

    const transaction = this.db.transaction(
      [this.requestStore, this.dataStore],
      "readwrite"
    );

    await Promise.all([
      this.cleanupStore(transaction.objectStore(this.requestStore), cutoffTime),
      this.cleanupStore(transaction.objectStore(this.dataStore), cutoffTime),
    ]);
  }

  private cleanupStore(
    store: IDBObjectStore,
    cutoffTime: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const index = store.index("timestamp");
      const range = IDBKeyRange.upperBound(cutoffTime);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}
