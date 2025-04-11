
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Edit, Trash2, PlusIcon } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/menuItemsApi';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface MenuItemsListProps {
  choiceId: string;
  choiceLabel: string;
}

const MenuItemsList: React.FC<MenuItemsListProps> = ({ choiceId, choiceLabel }) => {
  const {
    menuItems,
    isLoading,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuItems(choiceId);

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Group items by category
  const groupedItems: { [key: string]: MenuItem[] } = {};
  
  menuItems.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  if (isLoading) {
    return <div className="text-center py-2 text-sm text-gray-500">Loading items...</div>;
  }

  return (
    <div className="space-y-4">
      {menuItems.length === 0 ? (
        <div className="text-center py-2 text-sm text-gray-500">
          No items added yet
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <Badge variant="outline" className="text-xs mb-2">
                {category}
              </Badge>
              
              <div className="space-y-2">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between py-2 px-3 bg-white border border-gray-100 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.label} <span className="text-xs text-gray-500">({item.value})</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => setItemToDelete(item)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      )}
      
      <Button 
        size="sm"
        variant="outline"
        onClick={() => setIsAddDialogOpen(true)} 
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Item
      </Button>

      {/* Add Dialog */}
      <MenuItemDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
        onSubmit={data => handleAddItem({
          ...data,
          choice_id: choiceId
        })} 
        isSubmitting={isCreating} 
        title="Add Menu Item" 
        choiceId={choiceId} 
      />

      {/* Edit Dialog */}
      <MenuItemDialog 
        open={!!editingItem} 
        onOpenChange={open => !open && setEditingItem(null)} 
        onSubmit={data => {
          if (editingItem) {
            handleUpdateItem(editingItem.id, data);
          }
        }} 
        isSubmitting={isUpdating} 
        initialData={editingItem || undefined} 
        title="Edit Menu Item" 
        choiceId={choiceId} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!itemToDelete} 
        onOpenChange={open => !open && setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu item "{itemToDelete?.label}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) {
                  handleDeleteItem(itemToDelete.id);
                  setItemToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuItemsList;
