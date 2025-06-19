import React, { useEffect, useState } from 'react';
import { Toast } from './types';
import { getToastIcon, CloseIcon } from './ToastIcons';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300); // Match animation duration
  };

  const IconComponent = toast.icon ? () => <>{toast.icon}</> : getToastIcon(toast.type);

  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'loading':
        return 'border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'border-border bg-background text-text';
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'loading':
        return 'text-gray-500';
      default:
        return 'text-icon';
    }
  };

  return (
    <div
      className={`
        relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${getTypeStyles()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${toast.className}
      `}
      style={toast.style}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${getIconColor()}`}>
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="text-sm font-semibold mb-1">
            {toast.title}
          </div>
        )}
        <div className="text-sm">
          {toast.message}
        </div>
        {toast.description && (
          <div className="text-xs opacity-75 mt-1">
            {toast.description}
          </div>
        )}
        
        {/* Action Button */}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      {toast.dismissible && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          aria-label="Close notification"
        >
          <CloseIcon className="h-4 w-4 opacity-60 hover:opacity-100" />
        </button>
      )}
    </div>
  );
};

export default ToastItem;
