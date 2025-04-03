
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMenuItems } from '@/hooks/useMenuItems';
import { PlusIcon } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/menuItemsApi';

interface MenuItemsManagerProps {
  choiceId: string;
  choiceLabel: string;
}

const MenuItemsManager: React.FC<MenuItemsManagerProps> = ({ choiceId, choiceLabel }) => {
  const { 
    menuItems, 
    isLoading, 
    handleAddItem, 
    handleUpdateItem, 
    handleDeleteItem,
    setEditingItem,
    editingItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuItems(choiceId);

  // Get items for this choice
  const choiceItems = menuItems.filter(item => item.choice_id === choiceId);

  return (
    <div className="mt-2 pl-6 border-l-2 border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">Items for {choiceLabel}</h4>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusIcon className="h-3.5 w-3.5 mr-1" />
          Add Items
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-sm text-gray-500">Loading items...</div>
      ) : (
        <>
          {choiceItems.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-md">
              No items added to this choice yet
            </div>
          ) : (
            <MenuItemsTable 
              items={choiceItems}
              onEdit={(item) => setEditingItem(item)}
              onDelete={handleDeleteItem}
              isDeleting={isDeleting}
            />
          )}
        </>
      )}

      {/* Add Dialog */}
      <MenuItemDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => handleAddItem({...data, choice_id: choiceId})}
        isSubmitting={isCreating}
        title="Add Menu Item"
        choiceId={choiceId}
      />

      {/* Edit Dialog */}
      {editingItem && (
        <MenuItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSubmit={(data) => handleUpdateItem(editingItem.id, data)}
          isSubmitting={isUpdating}
          initialData={editingItem}
          title="Edit Menu Item"
          choiceId={choiceId}
        />
      )}
    </div>
  );
};

export default MenuItemsManager;
