import React, { useState } from 'react';
import { useOffline } from '@/hooks/useOffline';

interface SyncDashboardProps {
  className?: string;
  showDetailedStats?: boolean;
  enableManualActions?: boolean;
}

export const SyncDashboard: React.FC<SyncDashboardProps> = ({
  className = '',
  showDetailedStats = true,
  enableManualActions = true
}) => {
  const { state, actions } = useOffline();
  const { networkStatus, syncStatus, queueStats, config } = state;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSyncNow = async () => {
    if (networkStatus.isOnline && !syncStatus.isSyncing) {
      try {
        await actions.syncNow();
      } catch (error) {
        console.error('Manual sync failed:', error);
      }
    }
  };

  const handleRetryFailed = async () => {
    if (networkStatus.isOnline && !syncStatus.isSyncing) {
      try {
        await actions.retryFailedRequests();
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  };

  const handleClearQueue = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all pending requests? This action cannot be undone.'
    );
    if (confirmed) {
      try {
        await actions.clearQueue();
      } catch (error) {
        console.error('Clear queue failed:', error);
      }
    }
  };

  const getNetworkStatusColor = () => {
    if (!networkStatus.isOnline) return 'text-red-600';
    if (networkStatus.isSlowConnection) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getNetworkStatusIcon = () => {
    if (!networkStatus.isOnline) return '🔴';
    if (networkStatus.isSlowConnection) return '🟡';
    return '🟢';
  };

  const getSyncStatusColor = () => {
    if (syncStatus.isSyncing) return 'text-blue-600';
    if (syncStatus.failedRequests > 0) return 'text-red-600';
    if (queueStats.total > 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Sync Status</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Network Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{getNetworkStatusIcon()}</span>
            <div>
              <p className={`font-medium ${getNetworkStatusColor()}`}>
                {networkStatus.isOnline ? 'Online' : 'Offline'}
                {networkStatus.isSlowConnection && ' (Slow Connection)'}
              </p>
              <p className="text-sm text-gray-500">
                {networkStatus.connectionType && `Connection: ${networkStatus.connectionType}`}
              </p>
            </div>
          </div>
          
          {networkStatus.lastOfflineTime && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Last offline:</p>
              <p className="text-sm font-medium">
                {new Date(networkStatus.lastOfflineTime).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Sync Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className={`text-xl ${syncStatus.isSyncing ? 'animate-spin' : ''}`}>
              {syncStatus.isSyncing ? '🔄' : queueStats.total > 0 ? '⏳' : '✅'}
            </span>
            <div>
              <p className={`font-medium ${getSyncStatusColor()}`}>
                {syncStatus.isSyncing ? 'Syncing...' : 
                 queueStats.total > 0 ? `${queueStats.total} Pending` : 
                 'All Synced'}
              </p>
              {syncStatus.lastSyncTime && (
                <p className="text-sm text-gray-500">
                  Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {enableManualActions && (
            <div className="flex space-x-2">
              {networkStatus.isOnline && !syncStatus.isSyncing && queueStats.total > 0 && (
                <button
                  onClick={handleSyncNow}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Sync Now
                </button>
              )}
              
              {syncStatus.failedRequests > 0 && networkStatus.isOnline && (
                <button
                  onClick={handleRetryFailed}
                  className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                >
                  Retry Failed
                </button>
              )}
            </div>
          )}
        </div>

        {/* Queue Statistics */}
        {queueStats.total > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Pending Operations</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{queueStats.byPriority.high}</p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{queueStats.byPriority.medium}</p>
                <p className="text-sm text-gray-600">Medium Priority</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{queueStats.byPriority.low}</p>
                <p className="text-sm text-gray-600">Low Priority</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{queueStats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>

            {showDetailedStats && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">By Operation Type</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600">{queueStats.byOperation.create}</p>
                    <p className="text-xs text-gray-600">Create</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-600">{queueStats.byOperation.update}</p>
                    <p className="text-xs text-gray-600">Update</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-red-600">{queueStats.byOperation.delete}</p>
                    <p className="text-xs text-gray-600">Delete</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-purple-600">{queueStats.byOperation.custom}</p>
                    <p className="text-xs text-gray-600">Custom</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Configuration */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Offline Mode:</span>
                  <span className={`ml-2 font-medium ${config.enableOfflineMode ? 'text-green-600' : 'text-red-600'}`}>
                    {config.enableOfflineMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Auto Sync:</span>
                  <span className={`ml-2 font-medium ${config.enableBackgroundSync ? 'text-green-600' : 'text-red-600'}`}>
                    {config.enableBackgroundSync ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Max Retries:</span>
                  <span className="ml-2 font-medium">{config.maxRetries}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sync Interval:</span>
                  <span className="ml-2 font-medium">{config.syncInterval / 1000}s</span>
                </div>
              </div>
            </div>

            {/* Sync Errors */}
            {syncStatus.syncErrors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Recent Sync Errors</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {syncStatus.syncErrors.slice(-5).map((error, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-red-800 font-medium">{error.error}</p>
                      <p className="text-red-600 text-xs">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {enableManualActions && (
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={handleClearQueue}
                  disabled={queueStats.total === 0}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Queue
                </button>
                
                <button
                  onClick={() => actions.enableAutoSync()}
                  disabled={config.enableBackgroundSync}
                  className="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Enable Auto Sync
                </button>
                
                <button
                  onClick={() => actions.disableAutoSync()}
                  disabled={!config.enableBackgroundSync}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Disable Auto Sync
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncDashboard;
