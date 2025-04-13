
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Square } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import MenuItemsTable from './MenuItemsTable';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/types/menuItems';
import MenuItemInlineForm from './MenuItemInlineForm';
import MenuItemsByCategory from './MenuItemsByCategory';

interface MenuItemsManagerProps {
  choiceId: string;
  choiceLabel: string;
  hideChoiceLabel?: boolean;
}

// Menu types that should use the categorized layout (sec-mains and buffet menus)
const CATEGORY_CHOICE_VALUES = ['sec-mains', 'buffet-menu', 'cho-buffet'];

// All choices that should use the drag and drop functionality
const DRAG_DROP_CHOICE_VALUES = [
  // Main courses (should have categories)
  'sec-mains',
  // Buffet menus (should have categories)
  'buffet-menu', 
  'cho-buffet',
  // Karoo feasts
  'warm-karoo-feast',
  'cho-feast',
  // Other main course options that use drag but NOT categories
  'sec-main',
  'sec-main-vegetarian',
  'sec-main-vegan',
  // Plated menu options
  'plated-menu',
  'plated-main',
  'plated-starter'
];

const MenuItemsManager: React.FC<MenuItemsManagerProps> = ({
  choiceId,
  choiceLabel,
  hideChoiceLabel = false
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
    isReordering,
    refetchMenuItems
  } = useMenuItems(choiceId);

  const [showInlineForm, setShowInlineForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const choiceItems = useMemo(() => {
    const items = menuItems.filter(item => item.choice_id === choiceId);
    console.log(`MenuItemsManager: Found ${items.length} items for choice ${choiceId} (${choiceLabel})`);
    return items;
  }, [menuItems, choiceId, choiceLabel]);

  useEffect(() => {
    console.log(`MenuItemsManager: Initial load for choice ${choiceId} (${choiceLabel})`);
    refetchMenuItems();
  }, [refetchMenuItems, choiceId, choiceLabel]);

  const useDragDrop = useMemo(() => {
    if (!choiceItems.length) return false;

    const choiceValue = choiceItems[0]?.choice;
    console.log(`Choice value for ${choiceLabel}: ${choiceValue}`);
    
    // Check if this choice should use drag and drop
    return DRAG_DROP_CHOICE_VALUES.includes(choiceValue);
  }, [choiceItems, choiceLabel]);

  const useCategories = useMemo(() => {
    if (!choiceItems.length) return false;

    const choiceValue = choiceItems[0]?.choice;
    
    // Check if this choice should use categories
    return CATEGORY_CHOICE_VALUES.includes(choiceValue);
  }, [choiceItems]);

  const availableCategories = useMemo(() => {
    if (!useCategories || !choiceItems.length) return [];

    const categories = choiceItems.map(item => item.category).filter(Boolean) as string[];

    return [...new Set(categories)];
  }, [choiceItems, useCategories]);

  const handleAddInCategory = (category: string | null) => {
    console.log(`Adding item in category: ${category || 'none'}`);
    setSelectedCategory(category);
    setShowInlineForm(true);
  };

  const handleAddItemClick = () => {
    setSelectedCategory(null);
    setShowInlineForm(true);
  };

  return (
    <div className="mt-2 my-[7px]">
      {isLoading ? (
        <div className="text-center py-4 text-sm text-gray-500">Loading items...</div>
      ) : (
        <>
          {choiceItems.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-gray-500">No items added yet</p>
              <Button size="sm" onClick={handleAddItemClick} className="mt-2">
                <PlusIcon className="h-3 w-3 mr-1.5" />
                Add Item
              </Button>
            </div>
          ) : (
            <>
              {useDragDrop ? (
                <MenuItemsByCategory 
                  items={choiceItems} 
                  onEdit={item => setEditingItem(item)} 
                  onDelete={handleDeleteItem} 
                  isDeleting={isDeleting} 
                  onReorder={handleReorderItems}
                  onAddItem={handleAddInCategory}
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

      {showInlineForm && (
        <MenuItemInlineForm 
          onSubmit={data => {
            handleAddItem({
              ...data,
              choice_id: choiceId
            });
            setShowInlineForm(false);
            setSelectedCategory(null);
          }} 
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
