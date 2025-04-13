
import { useEffect } from 'react';

export const useMenuItemRefresh = (
  refetchMenuItems: () => void,
  invalidateAllQueries: () => void
) => {
  // Ensure we periodically refresh the data to catch any category changes
  useEffect(() => {
    // Initial fetch
    refetchMenuItems();

    // Set up interval for periodic refreshes
    const intervalId = setInterval(() => {
      console.log("Periodic refresh of menu items");
      invalidateAllQueries();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(intervalId);
  }, [refetchMenuItems, invalidateAllQueries]);
};
