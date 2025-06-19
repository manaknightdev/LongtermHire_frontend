import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from './ToastContext';
import ToastItem from './ToastItem';
import { ToastPosition } from './types';

interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  position = 'top-right',
  maxToasts = 5 
}) => {
  const { toasts, removeToast } = useToast();

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const pos = toast.position || position;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {} as Record<ToastPosition, typeof toasts>);

  const getPositionStyles = (pos: ToastPosition) => {
    const baseStyles = 'fixed z-[100000000002] flex flex-col gap-2 p-4 pointer-events-none';
    
    switch (pos) {
      case 'top-left':
        return `${baseStyles} top-0 left-0`;
      case 'top-center':
        return `${baseStyles} top-0 left-1/2 transform -translate-x-1/2`;
      case 'top-right':
        return `${baseStyles} top-0 right-0`;
      case 'bottom-left':
        return `${baseStyles} bottom-0 left-0`;
      case 'bottom-center':
        return `${baseStyles} bottom-0 left-1/2 transform -translate-x-1/2`;
      case 'bottom-right':
        return `${baseStyles} bottom-0 right-0`;
      default:
        return `${baseStyles} top-0 right-0`;
    }
  };

  const getFlexDirection = (pos: ToastPosition) => {
    return pos.startsWith('bottom') ? 'flex-col-reverse' : 'flex-col';
  };

  // Create portal to render toasts at the root level
  const portalRoot = document.getElementById('toast-root') || document.body;

  return createPortal(
    <>
      {Object.entries(toastsByPosition).map(([pos, positionToasts]) => {
        const limitedToasts = positionToasts.slice(0, maxToasts);
        
        return (
          <div
            key={pos}
            className={`${getPositionStyles(pos as ToastPosition)} ${getFlexDirection(pos as ToastPosition)}`}
          >
            {limitedToasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <ToastItem
                  toast={toast}
                  onRemove={removeToast}
                />
              </div>
            ))}
          </div>
        );
      })}
    </>,
    portalRoot
  );
};

export default ToastContainer;
