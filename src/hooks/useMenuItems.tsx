
import { useEffect } from 'react';
import { MenuItem, MenuItemFormData } from '@/api/menuItemsApi';
import { useMenuItemState } from './menu-items/useMenuItemState';
import { useMenuItemQueries } from './menu-items/useMenuItemQueries';
import { useMenuItemMutations } from './menu-items/useMenuItemMutations';
import { useMenuItemHandlers } from './menu-items/useMenuItemHandlers';
import { useMenuItemRefresh } from './menu-items/useMenuItemRefresh';

export const useMenuItems = (choiceId?: string) => {
  // State management
  const { 
    editingItem, 
    setEditingItem, 
    isAddDialogOpen, 
    setIsAddDialogOpen 
  } = useMenuItemState();

  // Queries
  const { 
    menuItems, 
    isLoading, 
    error, 
    refetchMenuItems, 
    invalidateAllQueries 
  } = useMenuItemQueries(choiceId);

  // Mutations
  const { 
    createMutation, 
    updateMutation, 
    deleteMutation, 
    reorderMutation,
    isCreating,
    isUpdating,
    isDeleting,
    isReordering
  } = useMenuItemMutations(
    invalidateAllQueries,
    refetchMenuItems,
    setIsAddDialogOpen,
    setEditingItem
  );

  // Action handlers
  const { 
    handleAddItem, 
    handleUpdateItem, 
    handleDeleteItem, 
    handleReorderItems 
  } = useMenuItemHandlers(
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation
  );

  // Setup periodic refresh
  useMenuItemRefresh(refetchMenuItems, invalidateAllQueries);

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
    isCreating,
    isUpdating,
    isDeleting,
    isReordering,
    refetchMenuItems
  };
};
