# Offline Service Plugin

A comprehensive offline mode service plugin for React applications that provides seamless offline functionality with automatic sync capabilities.

## Features

- **Network Detection**: Automatic online/offline status detection
- **Request Queueing**: Queue failed requests for retry when online
- **Offline Storage**: IndexedDB-based local storage for offline data
- **Optimistic Updates**: Immediate UI feedback for offline operations
- **Background Sync**: Automatic synchronization when connection returns
- **Priority-based Queue**: High, medium, and low priority request handling
- **React Integration**: Hooks and context providers for easy React integration
- **UI Components**: Pre-built components for offline status and notifications

## Quick Start

### 1. Wrap your app with OfflineProvider

```tsx
import { OfflineProvider } from '@/context/Offline';

function App() {
  return (
    <OfflineProvider
      enableNotifications={true}
      enableAutoSync={true}
      config={{
        enableOfflineMode: true,
        maxRetries: 3,
        syncInterval: 30000,
        enableOptimisticUpdates: true
      }}
    >
      <YourApp />
    </OfflineProvider>
  );
}
```

### 2. Use offline-aware hooks

```tsx
import { useOffline } from '@/hooks/useOffline';
import { useSDK } from '@/hooks/useSDK';

function MyComponent() {
  const { state, actions } = useOffline();
  const { sdk, tdk, isOfflineMode } = useSDK();
  
  // Network status
  const { isOnline, isOffline } = state.networkStatus;
  
  // Queue status
  const { total, byPriority } = state.queueStats;
  
  // Manual sync
  const handleSync = async () => {
    await actions.syncNow();
  };
}
```

### 3. Use offline-aware components

```tsx
import { OfflineAwareForm } from '@/components/OfflineAwareForm';
import { OfflineAwareMkdListTable } from '@/components/MkdListTable/OfflineAware';

function MyForm() {
  return (
    <OfflineAwareForm
      onSubmit={handleSubmit}
      table="users"
      operation="create"
      enableOptimisticSubmit={true}
    >
      {/* Your form fields */}
    </OfflineAwareForm>
  );
}
```

## Architecture

### Core Components

1. **OfflineService**: Main service class that coordinates all offline functionality
2. **OfflineStorageManager**: IndexedDB wrapper for local data storage
3. **RequestQueue**: Manages queued requests with priority and retry logic
4. **OfflineSDKMixin**: Enhances SDK classes with offline capabilities

### Data Flow

1. **Online**: Requests go directly to server
2. **Offline**: Requests are queued and optimistic updates applied
3. **Back Online**: Queued requests are automatically synced

### Storage Structure

- **Requests Store**: Queued API requests with metadata
- **Data Store**: Offline data with sync status
- **Automatic Cleanup**: Old data is cleaned up periodically

## Configuration

```tsx
interface OfflineConfig {
  enableOfflineMode: boolean;        // Enable/disable offline functionality
  maxRetries: number;               // Max retry attempts per request
  retryDelay: number;               // Base delay between retries (ms)
  maxQueueSize: number;             // Maximum queued requests
  syncInterval: number;             // Background sync interval (ms)
  enableOptimisticUpdates: boolean; // Enable optimistic UI updates
  enableBackgroundSync: boolean;    // Enable automatic background sync
  storageQuota: number;             // Storage quota in MB
  enableNotifications: boolean;     // Enable user notifications
}
```

## API Reference

### useOffline Hook

```tsx
const { state, actions } = useOffline();

// State
state.networkStatus     // Network connection info
state.syncStatus       // Sync operation status
state.queueStats       // Queue statistics
state.config          // Current configuration
state.notifications   // Active notifications

// Actions
actions.syncNow()                    // Manual sync
actions.queueRequest(request)        // Queue a request
actions.storeOfflineData(data)       // Store data locally
actions.addNotification(notification) // Add notification
actions.updateConfig(config)         // Update configuration
```

### Enhanced SDK Usage

```tsx
// Automatic offline handling
const result = await sdk.create('users', userData);
if (result.offline) {
  // Request was queued for offline sync
  console.log('Queued for sync:', result.requestId);
}

// Check sync status
const syncStatus = sdk.getSyncStatus();
console.log('Pending requests:', syncStatus.pendingRequests);

// Force sync
await sdk.forceSync();
```

## UI Components

### OfflineStatusBar
Shows overall offline status and pending operations.

```tsx
<OfflineStatusBar 
  position="top" 
  collapsible={true} 
/>
```

### OfflineIndicator
Compact status indicator for current connection state.

```tsx
<OfflineIndicator 
  position="top-right"
  showWhenOnline={false}
/>
```

### OfflineNotifications
Toast-style notifications for offline events.

```tsx
<OfflineNotifications 
  position="top-right"
  maxNotifications={5}
/>
```

### SyncDashboard
Comprehensive dashboard for monitoring sync status.

```tsx
<SyncDashboard 
  showDetailedStats={true}
  enableManualActions={true}
/>
```

### OfflineAwareForm
Form wrapper with offline handling.

```tsx
<OfflineAwareForm
  onSubmit={handleSubmit}
  table="users"
  operation="create"
  showOfflineWarning={true}
  enableOptimisticSubmit={true}
>
  {/* Form fields */}
</OfflineAwareForm>
```

### OfflineAwareMkdListTable
Enhanced table with offline data indicators.

```tsx
<OfflineAwareMkdListTable
  table="users"
  showOfflineIndicators={true}
  enableOfflineActions={true}
  // ... other MkdListTable props
/>
```

## Best Practices

### 1. Error Handling
Always handle both online and offline scenarios:

```tsx
try {
  const result = await sdk.create('users', data);
  if (result.offline) {
    // Handle offline case
    showMessage('Saved offline, will sync when online');
  } else {
    // Handle online case
    showMessage('Saved successfully');
  }
} catch (error) {
  // Handle errors
  showError('Failed to save');
}
```

### 2. Optimistic Updates
Use optimistic updates for better UX:

```tsx
// Update UI immediately
updateLocalState(newData);

// Then sync with server
try {
  await sdk.update('users', id, newData);
} catch (error) {
  // Revert on error
  revertLocalState();
}
```

### 3. Priority Management
Set appropriate priorities for requests:

```tsx
// High priority for user actions
await actions.queueRequest({
  // ... request data
  priority: 'high'
});

// Low priority for analytics
await actions.queueRequest({
  // ... request data
  priority: 'low'
});
```

### 4. Storage Management
Monitor storage usage:

```tsx
const { state } = useOffline();
if (state.queueStats.total > 50) {
  // Warn user about many pending changes
  showWarning('Many changes pending sync');
}
```

## Troubleshooting

### Common Issues

1. **Requests not syncing**: Check network status and sync configuration
2. **Storage quota exceeded**: Implement cleanup or increase quota
3. **Optimistic updates not working**: Verify SDK integration
4. **Performance issues**: Reduce sync interval or queue size

### Debug Tools

```tsx
// Check service status
const { state } = useOffline();
console.log('Network:', state.networkStatus);
console.log('Queue:', state.queueStats);
console.log('Sync:', state.syncStatus);

// Manual operations
await actions.syncNow();
await actions.clearQueue();
```

## Migration Guide

### From Regular SDK to Offline-Aware SDK

1. Wrap app with OfflineProvider
2. Update SDK usage to handle offline responses
3. Add offline UI components
4. Test offline scenarios

### Existing Forms

1. Replace form components with OfflineAwareForm
2. Update submit handlers to handle offline responses
3. Add offline status indicators

This offline service plugin provides a robust foundation for building offline-capable applications with seamless user experience.
