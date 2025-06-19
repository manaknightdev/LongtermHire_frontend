import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { Toast, ToastOptions, ToastContextType } from "./types";

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: "ADD_TOAST"; payload: Toast }
  | { type: "REMOVE_TOAST"; payload: string }
  | { type: "CLEAR_ALL_TOASTS" };

const initialState: ToastState = {
  toasts: [],
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case "CLEAR_ALL_TOASTS":
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback(
    (message: string, options: ToastOptions = {}): string => {
      const id = options.id || generateId();

      const toast: Toast = {
        id,
        message,
        type: options.type || "info",
        title: options.title || "",
        description: options.description || "",
        duration: options.duration ?? 5000,
        position: options.position || "top-right",
        dismissible: options.dismissible ?? true,
        className: options.className || "",
        style: options.style || {},
        createdAt: Date.now(),
        action: options.action,
        icon: options.icon,
        onDismiss: options.onDismiss,
      };

      dispatch({ type: "ADD_TOAST", payload: toast });

      // Auto-remove toast after duration (if not loading type)
      if (toast.duration > 0 && toast.type !== "loading") {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration);
      }

      return id;
    },
    [generateId]
  );

  const removeToast = useCallback(
    (id: string) => {
      const toast = state.toasts.find((t) => t.id === id);
      if (toast?.onDismiss) {
        toast.onDismiss();
      }
      dispatch({ type: "REMOVE_TOAST", payload: id });
    },
    [state.toasts]
  );

  const clearAllToasts = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_TOASTS" });
  }, []);

  const success = useCallback(
    (message: string, options: Omit<ToastOptions, "type"> = {}) => {
      return addToast(message, { ...options, type: "success" });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options: Omit<ToastOptions, "type"> = {}) => {
      return addToast(message, { ...options, type: "error" });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options: Omit<ToastOptions, "type"> = {}) => {
      return addToast(message, { ...options, type: "warning" });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options: Omit<ToastOptions, "type"> = {}) => {
      return addToast(message, { ...options, type: "info" });
    },
    [addToast]
  );

  const loading = useCallback(
    (message: string, options: Omit<ToastOptions, "type"> = {}) => {
      return addToast(message, { ...options, type: "loading", duration: 0 });
    },
    [addToast]
  );

  const promise = useCallback(
    async <T,>(
      promiseToResolve: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ): Promise<T> => {
      const loadingId = loading(options.loading);

      try {
        const data = await promiseToResolve;
        removeToast(loadingId);

        const successMessage =
          typeof options.success === "function"
            ? options.success(data)
            : options.success;
        success(successMessage);

        return data;
      } catch (err) {
        removeToast(loadingId);

        const errorMessage =
          typeof options.error === "function"
            ? options.error(err)
            : options.error;
        error(errorMessage);

        throw err;
      }
    },
    [loading, removeToast, success, error]
  );

  const value: ToastContextType = {
    toasts: state.toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    loading,
    promise,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
