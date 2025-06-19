import React from 'react';
import { useOffline } from '@/hooks/useOffline';

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  className = '',
  showDetails = false,
  position = 'bottom-right'
}) => {
  const { state, actions } = useOffline();
  const { syncStatus, queueStats, showSyncIndicator, networkStatus } = state;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  // Don't show if not syncing and no pending requests
  if (!showSyncIndicator && !syncStatus.isSyncing && queueStats.total === 0) {
    return null;
  }

  const handleSyncNow = async () => {
    if (networkStatus.isOnline && !syncStatus.isSyncing) {
      try {
        await actions.syncNow();
      } catch (error) {
        console.error('Manual sync failed:', error);
      }
    }
  };

  const getSyncIcon = () => {
    if (syncStatus.isSyncing) return '🔄';
    if (queueStats.total > 0) return '⏳';
    return '✅';
  };

  const getSyncText = () => {
    if (syncStatus.isSyncing) return 'Syncing...';
    if (queueStats.total > 0) return `${queueStats.total} pending`;
    return 'All synced';
  };

  const getStatusColor = () => {
    if (syncStatus.isSyncing) return 'bg-blue-500';
    if (queueStats.total > 0) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      className={`fixed z-40 ${positionClasses[position]} ${className}`}
    >
      <div
        className={`
          ${getStatusColor()}
          text-white p-3 rounded-lg shadow-lg
          transition-all duration-300 ease-in-out
          ${showDetails ? 'min-w-64' : 'min-w-32'}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span 
              className={`text-lg ${syncStatus.isSyncing ? 'animate-spin' : ''}`}
            >
              {getSyncIcon()}
            </span>
            <span className="text-sm font-medium">
              {getSyncText()}
            </span>
          </div>
          
          {networkStatus.isOnline && !syncStatus.isSyncing && queueStats.total > 0 && (
            <button
              onClick={handleSyncNow}
              className="
                ml-2 px-2 py-1 text-xs font-medium rounded
                bg-white bg-opacity-20 hover:bg-opacity-30
                transition-colors duration-200
              "
            >
              Sync Now
            </button>
          )}
        </div>

        {showDetails && (
          <div className="mt-2 space-y-1">
            {queueStats.total > 0 && (
              <div className="text-xs opacity-90">
                <div className="flex justify-between">
                  <span>High Priority:</span>
                  <span>{queueStats.byPriority.high}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Priority:</span>
                  <span>{queueStats.byPriority.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Priority:</span>
                  <span>{queueStats.byPriority.low}</span>
                </div>
              </div>
            )}
            
            {syncStatus.failedRequests > 0 && (
              <div className="text-xs text-red-200">
                {syncStatus.failedRequests} failed requests
              </div>
            )}
            
            {syncStatus.lastSyncTime && (
              <div className="text-xs opacity-75">
                Last sync: {new Date(syncStatus.lastSyncTime).toLocaleTimeString()}
              </div>
            )}
            
            {queueStats.oldestTimestamp && (
              <div className="text-xs opacity-75">
                Oldest: {new Date(queueStats.oldestTimestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {syncStatus.syncErrors.length > 0 && (
          <div className="mt-2 text-xs text-red-200">
            <details>
              <summary className="cursor-pointer">
                {syncStatus.syncErrors.length} sync errors
              </summary>
              <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                {syncStatus.syncErrors.slice(-3).map((error, index) => (
                  <div key={index} className="text-xs opacity-90">
                    <div className="font-medium">{error.error}</div>
                    <div className="opacity-75">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyncStatusIndicator;
