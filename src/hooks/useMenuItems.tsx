
import { useState, useCallback } from 'react';
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
    staleTime: 1000, // Much shorter stale time to ensure more frequent refreshes
  });

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      // Invalidate all related queries for maximum refresh
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      // Also invalidate the categories list to ensure new categories appear
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Menu item created successfully');
      setIsAddDialogOpen(false);
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Failed to create menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuItemFormData> }) => 
      updateMenuItem(id, data),
    onSuccess: () => {
      // Invalidate all related queries for maximum refresh
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      // Also invalidate the categories list
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Menu item updated successfully');
      setEditingItem(null);
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      // Invalidate all related queries for maximum refresh
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      // Also invalidate the categories list
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      toast.success('Menu item deleted successfully');
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Failed to delete menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const reorderMutation = useMutation({
    mutationFn: reorderMenuItems,
    onSuccess: () => {
      // Invalidate all related queries for maximum refresh
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      toast.success('Menu items reordered successfully');
      
      // Give database time to update, then refresh
      setTimeout(() => {
        refetchMenuItems();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Failed to reorder menu items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleAddItem = (data: MenuItemFormData) => {
    createMutation.mutate(data);
  };

  const handleUpdateItem = (id: string, data: Partial<MenuItemFormData>) => {
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
