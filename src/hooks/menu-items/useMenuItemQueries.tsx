
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMenuItems, fetchMenuItemsByChoice } from '@/api/menuItemsApi';

export const useMenuItemQueries = (choiceId?: string) => {
  const queryClient = useQueryClient();
  
  const queryKey = choiceId 
    ? ['menuItems', choiceId] 
    : ['menuItems'];

  const queryFn = useCallback(
    () => choiceId ? fetchMenuItemsByChoice(choiceId) : fetchMenuItems(),
    [choiceId]
  );

  const { 
    data: menuItems = [], 
    isLoading, 
    error,
    refetch: refetchMenuItems
  } = useQuery({
    queryKey,
    queryFn,
    staleTime: 0, // No stale time to ensure frequent refreshes
  });

  // Function to invalidate all relevant queries
  const invalidateAllQueries = useCallback(() => {
    console.log('Invalidating menu item queries...');
    
    // Invalidate menu items queries
    queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    if (choiceId) {
      queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
    }
    
    // Invalidate category queries
    queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
    queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    
    // Invalidate with choiceId if available
    if (choiceId) {
      console.log(`Invalidating queries for choice: ${choiceId}`);
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
      
      // Also invalidate the category order queries
      queryClient.invalidateQueries({ queryKey: ['menu-choice-category-order', choiceId] });
    }
    
    // Also invalidate with timestamps for maximum freshness
    const timestamp = Date.now();
    queryClient.invalidateQueries({ queryKey: ['menu-categories-list', timestamp] });
    queryClient.invalidateQueries({ queryKey: ['menu-categories', timestamp] });
    
    // Force refetch
    refetchMenuItems();
    
    console.log('Query invalidation complete');
  }, [queryClient, choiceId, refetchMenuItems]);

  return {
    menuItems,
    isLoading,
    error,
    refetchMenuItems,
    invalidateAllQueries
  };
};
