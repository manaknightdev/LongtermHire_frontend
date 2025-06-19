import React from 'react';
import { useToast } from './ToastContext';

const ToastExample: React.FC = () => {
  const toast = useToast();

  const handleBasicToasts = () => {
    toast.success('Operation completed successfully!');
    setTimeout(() => toast.error('Something went wrong!'), 1000);
    setTimeout(() => toast.warning('Please check your input'), 2000);
    setTimeout(() => toast.info('Here is some information'), 3000);
  };

  const handleAdvancedToasts = () => {
    // Toast with title and description
    toast.success('Payment Processed', {
      title: 'Success!',
      description: 'Your payment has been processed successfully.',
      duration: 6000,
    });

    // Toast with action button
    setTimeout(() => {
      toast.error('Failed to save changes', {
        title: 'Error',
        description: 'Unable to save your changes. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => {
            toast.info('Retrying...');
          },
        },
        duration: 8000,
      });
    }, 1000);
  };

  const handlePositionedToasts = () => {
    toast.success('Top Left', { position: 'top-left' });
    toast.info('Top Center', { position: 'top-center' });
    toast.warning('Bottom Left', { position: 'bottom-left' });
    toast.error('Bottom Right', { position: 'bottom-right' });
  };

  const handleLoadingToast = () => {
    const loadingId = toast.loading('Processing your request...');
    
    // Simulate async operation
    setTimeout(() => {
      toast.removeToast(loadingId);
      toast.success('Request completed!');
    }, 3000);
  };

  const handlePromiseToast = async () => {
    const mockApiCall = () => 
      new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve('Success data') : reject('API Error');
        }, 2000);
      });

    try {
      await toast.promise(mockApiCall(), {
        loading: 'Calling API...',
        success: 'API call successful!',
        error: 'API call failed!',
      });
    } catch (error) {
      console.log('Promise rejected:', error);
    }
  };

  const handleCustomToast = () => {
    toast.addToast('Custom styled toast', {
      type: 'info',
      title: 'Custom Toast',
      description: 'This toast has custom styling',
      className: 'border-purple-500 bg-purple-50 text-purple-900',
      icon: (
        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">🎉</span>
        </div>
      ),
      duration: 7000,
    });
  };

  const handlePersistentToast = () => {
    toast.addToast('This toast will stay until manually dismissed', {
      type: 'warning',
      title: 'Persistent Toast',
      description: 'This toast has no auto-dismiss timer',
      duration: 0, // No auto-dismiss
      action: {
        label: 'Got it',
        onClick: () => toast.clearAllToasts(),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text mb-2">Toast System Demo</h1>
        <p className="text-secondary">
          Try out different toast configurations and features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Toasts */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Basic Toasts</h3>
          <button
            onClick={handleBasicToasts}
            className="w-full bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Basic Toasts
          </button>
        </div>

        {/* Advanced Toasts */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Advanced Toasts</h3>
          <button
            onClick={handleAdvancedToasts}
            className="w-full bg-accent hover:bg-accent-hover text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Advanced Toasts
          </button>
        </div>

        {/* Positioned Toasts */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Different Positions</h3>
          <button
            onClick={handlePositionedToasts}
            className="w-full bg-secondary hover:bg-secondary-hover text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Positioned Toasts
          </button>
        </div>

        {/* Loading Toast */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Loading Toast</h3>
          <button
            onClick={handleLoadingToast}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Loading Toast
          </button>
        </div>

        {/* Promise Toast */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Promise Toast</h3>
          <button
            onClick={handlePromiseToast}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Promise Toast
          </button>
        </div>

        {/* Custom Toast */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Custom Toast</h3>
          <button
            onClick={handleCustomToast}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Custom Toast
          </button>
        </div>

        {/* Persistent Toast */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Persistent Toast</h3>
          <button
            onClick={handlePersistentToast}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Show Persistent Toast
          </button>
        </div>

        {/* Clear All */}
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="font-semibold text-text mb-3">Clear All</h3>
          <button
            onClick={() => toast.clearAllToasts()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Clear All Toasts
          </button>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="font-semibold text-text mb-4">Usage Examples</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-background-active p-3 rounded">
            <code className="text-accent">toast.success('Success message')</code>
          </div>
          <div className="bg-background-active p-3 rounded">
            <code className="text-accent">
              toast.error('Error message', {`{ title: 'Error', description: 'Details...' }`})
            </code>
          </div>
          <div className="bg-background-active p-3 rounded">
            <code className="text-accent">
              toast.promise(apiCall(), {`{ loading: 'Loading...', success: 'Done!', error: 'Failed!' }`})
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastExample;
