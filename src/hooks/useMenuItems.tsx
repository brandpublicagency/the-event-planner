
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchMenuItems, 
  fetchMenuItemsByChoice,
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  reorderMenuItems,
  MenuItem,
  MenuItemFormData
} from '@/api/menuItemsApi';

export const useMenuItems = (choiceId?: string) => {
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
    }
    
    // Also invalidate with timestamps for maximum freshness
    const timestamp = Date.now();
    queryClient.invalidateQueries({ queryKey: ['menu-categories-list', timestamp] });
    queryClient.invalidateQueries({ queryKey: ['menu-categories', timestamp] });
    
    // Force refetch
    refetchMenuItems();
  }, [queryClient, choiceId, refetchMenuItems]);

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

  const createMutation = useMutation({
    mutationFn: (data: MenuItemFormData) => {
      console.log("Creating menu item with data:", data);
      // Handle the special "no-category" case
      let processedData = { ...data };
      if (processedData.category === "no-category") {
        processedData.category = null;
      }
      return createMenuItem(processedData);
    },
    onSuccess: () => {
      toast.success('Menu item created successfully');
      setIsAddDialogOpen(false);
      
      // Invalidate all relevant queries
      invalidateAllQueries();
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      console.error("Error creating menu item:", error);
      toast.error(`Failed to create menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuItemFormData> }) => {
      console.log("Updating menu item with data:", data);
      // Handle the special "no-category" case
      let processedData = { ...data };
      if (processedData.category === "no-category") {
        processedData.category = null;
      }
      return updateMenuItem(id, processedData);
    },
    onSuccess: () => {
      toast.success('Menu item updated successfully');
      setEditingItem(null);
      
      // Invalidate all relevant queries
      invalidateAllQueries();
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      console.error("Error updating menu item:", error);
      toast.error(`Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      toast.success('Menu item deleted successfully');
      
      // Invalidate all relevant queries
      invalidateAllQueries();
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      console.error("Error deleting menu item:", error);
      toast.error(`Failed to delete menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderMenuItems,
    onSuccess: () => {
      toast.success('Menu items reordered successfully');
      
      // Invalidate menu items queries
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      console.error("Error reordering menu items:", error);
      toast.error(`Failed to reorder menu items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleAddItem = (data: MenuItemFormData) => {
    console.log("Adding item with data:", data);
    createMutation.mutate(data);
  };

  const handleUpdateItem = (id: string, data: Partial<MenuItemFormData>) => {
    console.log("Updating item with data:", data);
    updateMutation.mutate({ id, data });
  };

  const handleDeleteItem = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReorderItems = (reorderedItems: MenuItem[]) => {
    reorderMutation.mutate(reorderedItems);
  };

  return {
    menuItems,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleReorderItems,
    editingItem,
    setEditingItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
    refetchMenuItems
  };
};
