import React, { useState } from "react";
import { useOffline } from "@/hooks/useOffline";
import { useSDK } from "@/hooks/useSDK";
import { OfflineAwareForm } from "@/components/OfflineAwareForm";
import { SyncDashboard } from "@/components/SyncDashboard";
import { OfflineAwareMkdListTable } from "@/components/MkdListTable/OfflineAware";
import { useGetPaginateQuery } from "@/query/shared/listModel";
import { ApiResponse } from "@/utils/TreeSDK";

// Extended interface for offline-aware API responses
interface OfflineAwareApiResponse<T = any> extends ApiResponse<T> {
  offline?: boolean;
  requestId?: string;
  success?: boolean;
}

/**
 * Example component demonstrating offline functionality
 */
export const OfflineExample: React.FC = () => {
  const { state, actions } = useOffline();
  const { tdk, isOfflineMode } = useSDK();
  const [selectedTab, setSelectedTab] = useState<
    "form" | "table" | "dashboard"
  >("form");

  // Example query with offline support
  const {
    data: _usersData,
    isLoading,
    error,
    refetch,
  } = useGetPaginateQuery(
    "users",
    { size: 10, page: 1 },
    { enableOfflineCache: true }
  );

  // Example form submission
  const handleFormSubmit = async (formData: any) => {
    try {
      const result = (await tdk.create(
        "users",
        formData
      )) as OfflineAwareApiResponse;

      if (result.offline) {
        console.log("Form submitted offline, queued for sync");
        return {
          success: true,
          message: "User created offline, will sync when online",
          offline: true,
        };
      } else {
        console.log("Form submitted online successfully");
        // Refetch data to show updated list
        refetch();
        return {
          success: true,
          message: "User created successfully",
        };
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      throw error;
    }
  };

  // Example manual sync
  const handleManualSync = async () => {
    try {
      const result = await actions.syncNow();
      console.log(
        `Sync completed: ${result.success} success, ${result.failed} failed`
      );

      // Refetch data after sync
      if (result.success > 0) {
        refetch();
      }
    } catch (error) {
      console.error("Manual sync failed:", error);
    }
  };

  // Example table actions
  const tableActions = {
    view: {
      show: true,
      multiple: false,
      action: (row: any) => {
        console.log("View user:", row);
      },
      locations: [],
      children: "View",
    },
    edit: {
      show: true,
      multiple: false,
      action: (row: any) => {
        console.log("Edit user:", row);
      },
      locations: [],
      children: "Edit",
    },
    delete: {
      show: true,
      multiple: false,
      action: async (ids: any) => {
        try {
          const result = (await tdk.delete(
            "users",
            ids[0]
          )) as OfflineAwareApiResponse;
          if (result.offline) {
            console.log("Delete queued for offline sync");
          } else {
            console.log("User deleted successfully");
            refetch();
          }
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
      locations: [],
      children: "Delete",
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Offline Mode Example
        </h1>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Network Status</h3>
            <p
              className={`text-lg font-semibold ${
                state.networkStatus.isOnline ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.networkStatus.isOnline ? "Online" : "Offline"}
            </p>
            {state.networkStatus.isSlowConnection && (
              <p className="text-sm text-yellow-600">Slow Connection</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Pending Sync</h3>
            <p className="text-lg font-semibold text-blue-600">
              {state.queueStats.total}
            </p>
            <p className="text-sm text-gray-600">
              H:{state.queueStats.byPriority.high} M:
              {state.queueStats.byPriority.medium} L:
              {state.queueStats.byPriority.low}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">Offline Mode</h3>
            <p
              className={`text-lg font-semibold ${
                isOfflineMode ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isOfflineMode ? "Enabled" : "Disabled"}
            </p>
            <p className="text-sm text-gray-600">
              SDK: {isOfflineMode ? "Offline-Aware" : "Standard"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleManualSync}
            disabled={
              !state.networkStatus.isOnline || state.syncStatus.isSyncing
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.syncStatus.isSyncing ? "Syncing..." : "Manual Sync"}
          </button>

          <button
            onClick={() => actions.clearQueue()}
            disabled={state.queueStats.total === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Queue
          </button>

          <button
            onClick={() => {
              // Simulate going offline for testing
              window.dispatchEvent(new Event("offline"));
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Simulate Offline
          </button>

          <button
            onClick={() => {
              // Simulate going online for testing
              window.dispatchEvent(new Event("online"));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Simulate Online
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: "form", label: "Offline Form" },
              { key: "table", label: "Offline Table" },
              { key: "dashboard", label: "Sync Dashboard" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === "form" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Offline-Aware Form</h2>
              <OfflineAwareForm
                onSubmit={handleFormSubmit}
                table="users"
                operation="create"
                showOfflineWarning={true}
                enableOptimisticSubmit={true}
                className="max-w-md"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </OfflineAwareForm>
            </div>
          )}

          {selectedTab === "table" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Offline-Aware Table
              </h2>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">
                  Error loading data: {error.message}
                </div>
              ) : (
                <OfflineAwareMkdListTable
                  table="users"
                  actions={tableActions}
                  showOfflineIndicators={true}
                  enableOfflineActions={true}
                />
              )}
            </div>
          )}

          {selectedTab === "dashboard" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Sync Dashboard</h2>
              <SyncDashboard
                showDetailedStats={true}
                enableManualActions={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineExample;
