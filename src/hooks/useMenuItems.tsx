
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  fetchMenuItems, 
  fetchMenuItemsByChoice,
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
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
    error 
  } = useQuery({
    queryKey,
    queryFn,
    enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      toast.success('Menu item created successfully');
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MenuItemFormData> }) => 
      updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      toast.success('Menu item updated successfully');
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(`Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
      toast.success('Menu item deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  return {
    menuItems,
    isLoading,
    error,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    editingItem,
    setEditingItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
