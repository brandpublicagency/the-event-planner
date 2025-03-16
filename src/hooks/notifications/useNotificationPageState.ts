
import { useState, useEffect } from 'react';

/**
 * Hook that manages state for the notification page
 */
export function useNotificationPageState(
  systemLoading,
  systemError,
  pendingNotifications
) {
  // Add loading state for button actions
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Group and sort notifications
  const notifications = pendingNotifications;
  const loading = systemLoading || isActionLoading;

  // If there's a system error, capture it
  useEffect(() => {
    if (systemError) {
      setError(systemError);
    }
  }, [systemError]);

  return {
    notifications,
    loading,
    error,
    isActionLoading,
    setIsActionLoading,
    setError
  };
}
