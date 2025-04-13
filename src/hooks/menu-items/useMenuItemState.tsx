
import { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';

export const useMenuItemState = () => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return {
    editingItem,
    setEditingItem,
    isAddDialogOpen,
    setIsAddDialogOpen
  };
};
