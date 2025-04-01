
import { useEffect } from 'react';

interface UseMenuRefreshProps {
  isInitialized: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isManualSaving: boolean;
  refreshMenu: (showFeedback: boolean) => void;
}

export const useMenuRefresh = ({
  isInitialized,
  isLoading,
  isSaving,
  isManualSaving,
  refreshMenu
}: UseMenuRefreshProps) => {
  // Periodically refresh data to ensure synchronized state
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (isInitialized && !isLoading && !isSaving && !isManualSaving) {
        console.log('Performing background menu refresh');
        refreshMenu(false);
      }
    }, 60000); // Refresh every minute if no active operations
    
    return () => clearInterval(refreshInterval);
  }, [isInitialized, isLoading, isSaving, isManualSaving, refreshMenu]);
};
