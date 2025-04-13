
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  reorderMenuItems,
  MenuItem,
  MenuItemFormData
} from '@/api/menuItemsApi';

export const useMenuItemMutations = (
  invalidateAllQueries: () => void,
  refetchMenuItems: () => void,
  setIsAddDialogOpen: (isOpen: boolean) => void,
  setEditingItem: (item: MenuItem | null) => void
) => {
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
      
      // Invalidate all relevant queries
      invalidateAllQueries();
      
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

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    reorderMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending
  };
};
