import React, { useState, useCallback } from "react";
import { useOffline } from "@/hooks/useOffline";
import { InteractiveButton } from "../InteractiveButton";

interface OfflineAwareFormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<any>;
  className?: string;
  showOfflineWarning?: boolean;
  enableOptimisticSubmit?: boolean;
  table?: string;
  operation?: "create" | "update" | "delete";
  formClassName?: string;
}

/**
 * Form wrapper that handles offline scenarios gracefully
 */
export const OfflineAwareForm: React.FC<OfflineAwareFormProps> = ({
  children,
  onSubmit,
  className = "",
  showOfflineWarning = true,
  enableOptimisticSubmit = true,
  table: _table,
  operation: _operation = "create",
  formClassName = "",
}) => {
  const { state, actions } = useOffline();
  const { networkStatus, queueStats } = state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitResult, setLastSubmitResult] = useState<any>(null);

  const getStatusIcon = () => {
    if (!networkStatus.isOnline) return "📴";
    if (networkStatus.isSlowConnection) return "🐌";
    if (queueStats.total > 0) return "⏳";
    return "🟢";
  };
  const getStatusText = () => {
    if (!networkStatus.isOnline) return "Offline";
    if (networkStatus.isSlowConnection) return "Slow Connection";
    if (queueStats.total > 0) return `${queueStats.total} Pending`;
    return "Online";
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (isSubmitting) return;

      setIsSubmitting(true);
      setLastSubmitResult(null);

      try {
        // Get form data
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        // If offline and optimistic submit is enabled, show immediate feedback
        if (!networkStatus.isOnline && enableOptimisticSubmit) {
          // Show optimistic success
          setLastSubmitResult({
            success: true,
            offline: true,
            message: "Changes saved locally and will sync when online",
          });

          // Add notification
          actions.addNotification({
            type: "info",
            title: "Saved Offline",
            message:
              "Your changes have been saved locally and will sync when you come back online.",
          });
        }

        // Call the actual submit function
        const result = await onSubmit(data);

        if (!networkStatus.isOnline) {
          // If we're offline, the result should indicate it was queued
          setLastSubmitResult({
            success: true,
            offline: true,
            queued: true,
            message: result.message || "Changes queued for sync",
          });
        } else {
          // Online submission
          setLastSubmitResult(result);
        }
      } catch (error) {
        console.error("Form submission error:", error);

        // If it's a network error and we're offline, treat as queued
        if (!networkStatus.isOnline) {
          setLastSubmitResult({
            success: true,
            offline: true,
            queued: true,
            message: "Changes saved locally due to network error",
          });

          actions.addNotification({
            type: "warning",
            title: "Saved Offline",
            message:
              "Network error detected. Changes saved locally and will sync when connection is restored.",
          });
        } else {
          setLastSubmitResult({
            success: false,
            error: error instanceof Error ? error.message : "Submission failed",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      onSubmit,
      isSubmitting,
      networkStatus.isOnline,
      enableOptimisticSubmit,
      actions,
    ]
  );

  return (
    <div className={`offline-aware-form ${className}`}>
      {/* Offline warning */}
      <div>
        {!networkStatus.isOnline && showOfflineWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-yellow-400 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium">You are currently offline</p>
                <p className="text-sm">
                  Your changes will be saved locally and synced when you
                  reconnect.
                  {queueStats.total > 0 &&
                    ` ${queueStats.total} changes are already pending sync.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success/Error messages */}
      <div>
        {lastSubmitResult && (
          <div
            className={`mb-4 !h-fit !min-h-fit !max-h-fit p-3 rounded-md ${
              lastSubmitResult.success
                ? lastSubmitResult.offline
                  ? "bg-blue-100 border border-blue-200 text-blue-700"
                  : "bg-green-100 border border-green-200 text-green-700"
                : "bg-red-100 border border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {lastSubmitResult.success ? (
                  lastSubmitResult.offline ? (
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {lastSubmitResult.success
                    ? lastSubmitResult.offline
                      ? "Saved Offline"
                      : "Success"
                    : "Error"}
                </p>
                <p className="text-sm">
                  {lastSubmitResult.message || lastSubmitResult.error}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={`space-y-4 ${formClassName}`}>
        {children}

        {/* Submit button with offline state */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {/* <div
              className={`w-2 h-2 rounded-full ${
                networkStatus.isOnline ? "bg-green-400" : "bg-red-400"
              }`}
            ></div> */}
            <span>{getStatusIcon()}</span>
            <span>
              {getStatusText()}
              {queueStats.total > 0 && ` • ${queueStats.total} pending`}
            </span>
          </div>

          <InteractiveButton
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className={`
              !px-4 py-2 rounded-md font-medium text-white
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : networkStatus.isOnline
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
              }
              transition-colors duration-200
            `}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : networkStatus.isOnline ? (
              "Save"
            ) : (
              "Save Offline"
            )}
          </InteractiveButton>
        </div>
      </form>
    </div>
  );
};

export default OfflineAwareForm;
