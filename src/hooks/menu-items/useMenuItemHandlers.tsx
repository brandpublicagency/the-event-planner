
import { MenuItemFormData, MenuItem } from '@/api/menuItemsApi';

export const useMenuItemHandlers = (
  createMutation: { mutate: (data: MenuItemFormData) => void },
  updateMutation: { mutate: (data: { id: string; data: Partial<MenuItemFormData> }) => void },
  deleteMutation: { mutate: (id: string) => void },
  reorderMutation: { mutate: (items: MenuItem[]) => void }
) => {
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
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleReorderItems
  };
};
