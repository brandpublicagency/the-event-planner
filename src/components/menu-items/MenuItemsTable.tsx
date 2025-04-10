
import React, { useState } from 'react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { MenuItem } from '@/api/menuItemsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus } from 'lucide-react';
import MenuItemDialog from './MenuItemDialog';
import MenuItemInlineForm from './MenuItemInlineForm';

interface MenuItemsTableProps {
  choiceId: string;
  availableCategories?: string[];
}

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({ 
  choiceId,
  availableCategories = []
}) => {
  const {
    menuItems,
    isLoading,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    isCreating,
    isUpdating,
    isDeleting,
    editingItem,
    setEditingItem
  } = useMenuItems(choiceId);

  const [isAddingNew, setIsAddingNew] = useState(false);

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Get all categories from the items
  const categories = Object.keys(groupedItems).sort();

  if (isLoading) {
    return <div className="text-center py-4">Loading menu items...</div>;
  }

  const handleCancelAdd = () => {
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {categories.length > 0 ? (
        categories.map(category => (
          <div key={category} className="space-y-2">
            <h3 className="text-md font-medium text-muted-foreground">
              {category}
            </h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-medium text-xs">Name</th>
                    <th className="text-left p-2 font-medium text-xs">Value</th>
                    <th className="text-left p-2 font-medium text-xs">Description</th>
                    <th className="text-right p-2 font-medium text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedItems[category].map(item => (
                    <tr key={item.id} className="border-t">
                      {editingItem && editingItem.id === item.id ? (
                        <td colSpan={4} className="p-2">
                          <MenuItemInlineForm
                            choiceId={choiceId}
                            initialData={editingItem}
                            onSubmit={(data) => handleUpdateItem(item.id, data)}
                            onCancel={handleCancelEdit}
                            isSubmitting={isUpdating}
                            availableCategories={availableCategories}
                          />
                        </td>
                      ) : (
                        <>
                          <td className="p-2 text-sm">{item.label}</td>
                          <td className="p-2 text-sm text-muted-foreground">{item.value}</td>
                          <td className="p-2 text-sm text-muted-foreground">
                            {item.description || '-'}
                          </td>
                          <td className="p-2 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingItem(item)}
                                disabled={isDeleting || Boolean(editingItem)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={isDeleting || Boolean(editingItem)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No menu items found. Add the first one below.
        </div>
      )}

      {isAddingNew ? (
        <div className="border rounded-md p-4 bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Add New Menu Item</h3>
          <MenuItemInlineForm
            choiceId={choiceId}
            onSubmit={handleAddItem}
            onCancel={handleCancelAdd}
            isSubmitting={isCreating}
            availableCategories={availableCategories}
          />
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          disabled={Boolean(editingItem)}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      )}
    </div>
  );
};

export default MenuItemsTable;
