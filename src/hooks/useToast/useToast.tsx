import { useToast as useToastContext } from '@/components/Toast';
import { ToastStatusEnum } from '@/utils/Enums';

/**
 * Hook that provides backward compatibility with the existing showToast function
 * while also exposing the new toast system capabilities
 */
export const useToast = () => {
  const toast = useToastContext();

  /**
   * Backward compatible showToast function
   * @param message - The toast message
   * @param duration - Duration in milliseconds (default: 5000)
   * @param status - Toast status (default: SUCCESS)
   */
  const showToast = (
    message: string,
    duration: number = 5000,
    status: ToastStatusEnum = ToastStatusEnum.SUCCESS
  ) => {
    const typeMap = {
      [ToastStatusEnum.SUCCESS]: 'success' as const,
      [ToastStatusEnum.ERROR]: 'error' as const,
      [ToastStatusEnum.WARNING]: 'warning' as const,
      [ToastStatusEnum.INFO]: 'info' as const,
    };

    const type = typeMap[status] || 'info';
    
    return toast.addToast(message, {
      type,
      duration,
      position: 'top-right', // Match original position
    });
  };

  return {
    // Backward compatibility
    showToast,
    
    // New toast system methods
    ...toast,
    
    // Convenience methods with better naming
    notify: toast.addToast,
    dismiss: toast.removeToast,
    dismissAll: toast.clearAllToasts,
  };
};

export default useToast;
