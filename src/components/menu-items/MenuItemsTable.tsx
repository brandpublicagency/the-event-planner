
import React, { useState } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

type MenuItemsTableProps = {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: MenuItem[]) => void;
  isDeleting: boolean;
  onAddItem?: (category: string | null) => void;
};

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  onEdit,
  onDelete,
  onReorder,
  isDeleting,
  onAddItem
}) => {
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  // Group items by category
  const groupedItems: {
    [key: string]: MenuItem[];
  } = {};
  
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });

  const categories = Object.keys(groupedItems);
  
  console.log("Categories available:", categories);

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No menu items found
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div 
              key={`category-${category}`}
              className="mb-6"
            >
              <div 
                className="space-y-2 border border-dashed border-gray-300 rounded-md p-2"
              >
                {category !== 'Uncategorized' && (
                  <div className="mb-1 px-1 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="inline-flex items-center border border-zinc-800 text-xs font-semibold py-[8px] px-[14px] rounded-lg bg-transparent my-[8px]">
                        {category}
                      </div>
                    </div>
                  </div>
                )}
                
                {groupedItems[category].map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-start bg-white border rounded-md p-2 mb-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {item.label} <span className="font-light text-xs text-gray-300">({item.value})</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onEdit(item)} 
                            className="h-6 w-6 text-zinc-400"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setItemToDelete(item)} 
                            className="h-6 w-6 text-zinc-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {onAddItem && (
                  <div className="pt-2 py-[9px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onAddItem(category !== 'Uncategorized' ? category : null)} 
                      className="w-full flex items-center justify-center border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-500 py-[10px]"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Item
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuItemsTable;
