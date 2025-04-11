
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useMenuItems } from '@/hooks/useMenuItems';
import { PlusIcon } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/menuItemsApi';
import MenuItemInlineForm from './MenuItemInlineForm';
import MenuItemsByCategory from './MenuItemsByCategory';

interface MenuItemsManagerProps {
  choiceId: string;
  choiceLabel: string;
}

interface MenuItemInlineFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  choiceId: string;
  availableCategories: string[];
  preSelectedCategory?: string | null;
}

const MULTI_CATEGORY_CHOICE_VALUES = [
  'buffet-menu',
  'warm-karoo-feast'
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get items for this choice
  const choiceItems = useMemo(() => {
    return menuItems.filter(item => item.choice_id === choiceId);
  }, [menuItems, choiceId]);

  // Determine if this choice should use categories
  const useCategories = useMemo(() => {
    if (!choiceItems.length) return false;
    
    // Check if this is a known multi-category choice like buffet menu
    const choiceValue = choiceItems[0]?.choice;
    return MULTI_CATEGORY_CHOICE_VALUES.includes(choiceValue);
  }, [choiceItems]);

  // Determine the available categories based on the choice
  const availableCategories = useMemo(() => {
    if (!useCategories) return [];
    
    const choiceValue = choiceItems[0]?.choice;
    
    if (choiceValue === 'buffet-menu') {
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    }
    
    if (choiceValue === 'warm-karoo-feast') {
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    }
    
    return [];
  }, [choiceItems, useCategories]);

  // Handler for when "Add Item" is clicked within a category
  const handleAddInCategory = (category: string | null) => {
    setSelectedCategory(category);
    setShowInlineForm(true);
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-normal text-zinc-900">Items for {choiceLabel}</h4>
        <Button 
          size="sm" 
          onClick={() => setShowInlineForm(true)} 
          className="font-light text-xs bg-white hover:bg-zinc-900 hover:text-white"
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
            <div className="text-center py-4 text-sm text-gray-500">
              No items added to this choice yet
            </div>
          ) : (
            <>
              {useCategories ? (
                <MenuItemsByCategory 
                  items={choiceItems} 
                  onEdit={item => setEditingItem(item)} 
                  onDelete={handleDeleteItem} 
                  isDeleting={isDeleting} 
                />
              ) : (
                <MenuItemsTable 
                  items={choiceItems} 
                  onEdit={item => setEditingItem(item)} 
                  onDelete={handleDeleteItem} 
                  onReorder={reorderedItems => handleReorderItems(reorderedItems)} 
                  isDeleting={isDeleting}
                  onAddItem={handleAddInCategory}
                />
              )}
            </>
          )}
        </>
      )}

      {/* Inline form for adding items - moved below the items table */}
      {showInlineForm && (
        <MenuItemInlineForm 
          onSubmit={handleAddItem} 
          onCancel={() => {
            setShowInlineForm(false);
            setSelectedCategory(null);
          }} 
          isSubmitting={isCreating} 
          choiceId={choiceId}
          availableCategories={availableCategories}
          preSelectedCategory={selectedCategory}
        />
      )}

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
      {editingItem && (
        <MenuItemDialog 
          open={!!editingItem} 
          onOpenChange={open => !open && setEditingItem(null)} 
          onSubmit={data => handleUpdateItem(editingItem.id, data)} 
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
