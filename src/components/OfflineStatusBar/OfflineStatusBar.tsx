import React, { useState } from 'react';
import { useOffline } from '@/hooks/useOffline';

interface OfflineStatusBarProps {
  className?: string;
  position?: 'top' | 'bottom';
  collapsible?: boolean;
}

export const OfflineStatusBar: React.FC<OfflineStatusBarProps> = ({
  className = '',
  position = 'top',
  collapsible = true
}) => {
  const { state, actions } = useOffline();
  const { networkStatus, syncStatus, queueStats, showOfflineIndicator } = state;
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Don't show if online and no pending requests
  if (networkStatus.isOnline && queueStats.total === 0 && !showOfflineIndicator) {
    return null;
  }

  const getStatusColor = () => {
    if (!networkStatus.isOnline) return 'bg-red-500';
    if (syncStatus.isSyncing) return 'bg-blue-500';
    if (queueStats.total > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusMessage = () => {
    if (!networkStatus.isOnline) {
      return `You're offline. ${queueStats.total} changes will sync when connection returns.`;
    }
    if (syncStatus.isSyncing) {
      return 'Syncing your changes...';
    }
    if (queueStats.total > 0) {
      return `${queueStats.total} changes pending sync.`;
    }
    return 'All changes synced.';
  };

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

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <div
      className={`
        fixed left-0 right-0 z-30 ${positionClasses}
        ${getStatusColor()}
        text-white shadow-lg
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'h-8' : 'h-auto'}
        ${className}
      `}
    >
      <div className="container mx-auto px-4">
        {/* Collapsed view */}
        {isCollapsed ? (
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {networkStatus.isOnline ? '🟢' : '🔴'} 
                {queueStats.total > 0 ? ` ${queueStats.total} pending` : ' Online'}
              </span>
            </div>
            
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Expand status bar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          /* Expanded view */
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {!networkStatus.isOnline ? '🔴' : syncStatus.isSyncing ? '🔄' : '🟢'}
                  </span>
                  <span className="font-medium">
                    {getStatusMessage()}
                  </span>
                </div>

                {queueStats.total > 0 && (
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span>High:</span>
                      <span className="font-medium">{queueStats.byPriority.high}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Medium:</span>
                      <span className="font-medium">{queueStats.byPriority.medium}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Low:</span>
                      <span className="font-medium">{queueStats.byPriority.low}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {/* Action buttons */}
                {networkStatus.isOnline && !syncStatus.isSyncing && queueStats.total > 0 && (
                  <button
                    onClick={handleSyncNow}
                    className="
                      px-3 py-1 text-sm font-medium rounded
                      bg-white bg-opacity-20 hover:bg-opacity-30
                      transition-colors duration-200
                    "
                  >
                    Sync Now
                  </button>
                )}

                {syncStatus.failedRequests > 0 && networkStatus.isOnline && (
                  <button
                    onClick={handleRetryFailed}
                    className="
                      px-3 py-1 text-sm font-medium rounded
                      bg-white bg-opacity-20 hover:bg-opacity-30
                      transition-colors duration-200
                    "
                  >
                    Retry Failed ({syncStatus.failedRequests})
                  </button>
                )}

                {collapsible && (
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Collapse status bar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Additional details */}
            {(syncStatus.lastSyncTime || syncStatus.syncErrors.length > 0) && (
              <div className="mt-2 pt-2 border-t border-white border-opacity-20">
                <div className="flex items-center justify-between text-sm opacity-90">
                  {syncStatus.lastSyncTime && (
                    <span>
                      Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
                    </span>
                  )}
                  
                  {syncStatus.syncErrors.length > 0 && (
                    <span className="text-red-200">
                      {syncStatus.syncErrors.length} sync errors
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineStatusBar;
