
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMenuItems } from '@/hooks/useMenuItems';
import { PlusIcon } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/menuItemsApi';
import MenuItemInlineForm from './MenuItemInlineForm';
interface MenuItemsManagerProps {
  choiceId: string;
  choiceLabel: string;
}
const MenuItemsManager: React.FC<MenuItemsManagerProps> = ({
  choiceId,
  choiceLabel
}) => {
  const {
    menuItems,
    isLoading,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleReorderItems,
    setEditingItem,
    editingItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting,
    isReordering
  } = useMenuItems(choiceId);

  // State for showing the inline form
  const [showInlineForm, setShowInlineForm] = useState(false);

  // Get items for this choice
  const choiceItems = menuItems.filter(item => item.choice_id === choiceId);
  return <div className="mt-2">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Items for {choiceLabel}</h4>
        <Button size="sm" onClick={() => setShowInlineForm(true)} className="font-light text-xs bg-white hover:bg-zinc-900 hover:text-white">
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Items
        </Button>
      </div>

      {/* Inline form for adding items */}
      {showInlineForm && <MenuItemInlineForm onSubmit={handleAddItem} onCancel={() => setShowInlineForm(false)} isSubmitting={isCreating} choiceId={choiceId} />}

      {isLoading ? <div className="text-center py-4 text-sm text-gray-500">Loading items...</div> : <>
          {choiceItems.length === 0 ? <div className="text-center py-4 text-sm text-gray-500">
              No items added to this choice yet
            </div> : <MenuItemsTable items={choiceItems} onEdit={item => setEditingItem(item)} onDelete={handleDeleteItem} onReorder={reorderedItems => handleReorderItems(reorderedItems)} isDeleting={isDeleting} />}
        </>}

      {/* Add Dialog */}
      <MenuItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={data => handleAddItem({
      ...data,
      choice_id: choiceId
    })} isSubmitting={isCreating} title="Add Menu Item" choiceId={choiceId} />

      {/* Edit Dialog */}
      {editingItem && <MenuItemDialog open={!!editingItem} onOpenChange={open => !open && setEditingItem(null)} onSubmit={data => handleUpdateItem(editingItem.id, data)} isSubmitting={isUpdating} initialData={editingItem} title="Edit Menu Item" choiceId={choiceId} />}
    </div>;
};
export default MenuItemsManager;
