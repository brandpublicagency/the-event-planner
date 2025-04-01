
import { useEffect, useRef } from 'react';

interface UseMenuRefreshProps {
  isInitialized: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isManualSaving: boolean;
  refreshMenu: (force?: boolean) => void;
  disableAutoSave?: boolean; // New option to control auto-saving
}

export const useMenuRefresh = ({
  isInitialized,
  isLoading,
  isSaving,
  isManualSaving,
  refreshMenu,
  disableAutoSave = false // Default to false for backward compatibility
}: UseMenuRefreshProps) => {
  const refreshTimer = useRef<number | null>(null);
  const lastRefreshTime = useRef<number>(0);

  // Set up periodic background refreshing
  useEffect(() => {
    // Only set up refresh if initialized and not loading
    if (!isInitialized || isLoading) return;

    const scheduleNextRefresh = () => {
      if (refreshTimer.current) {
        window.clearTimeout(refreshTimer.current);
      }

      refreshTimer.current = window.setTimeout(() => {
        const now = Date.now();
        // Only refresh if enough time has passed and not in middle of saving
        if (now - lastRefreshTime.current > 30000 && !isSaving && !isManualSaving) {
          console.log('Performing background refresh of menu data');
          lastRefreshTime.current = now;
          
          // When disableAutoSave is true, only fetch without saving
          refreshMenu(!disableAutoSave); // Pass force=false when disableAutoSave is true
        }
        scheduleNextRefresh();
      }, 60000); // Check every minute
    };

    // Initial data refresh when component is ready
    if (!disableAutoSave) {
      console.log('Initial menu data refresh');
      lastRefreshTime.current = Date.now();
      refreshMenu(false); // Don't force on initial load
    }

    scheduleNextRefresh();

    return () => {
      if (refreshTimer.current) {
        window.clearTimeout(refreshTimer.current);
      }
    };
  }, [isInitialized, isLoading, isSaving, isManualSaving, refreshMenu, disableAutoSave]);
};
