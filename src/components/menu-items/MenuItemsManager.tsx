
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

const MULTI_CATEGORY_CHOICE_VALUES = [
  'buffet-menu', 
  'warm-karoo-feast', 
  'cho-buffet',
  'sec-mains',
  'sec-main',
  'sec-main-vegetarian',
  'sec-main-vegan'
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

  // State for showing the inline form
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get items for this choice
  const choiceItems = useMemo(() => {
    const items = menuItems.filter(item => item.choice_id === choiceId);
    console.log(`MenuItemsManager: Found ${items.length} items for choice ${choiceId} (${choiceLabel})`);
    return items;
  }, [menuItems, choiceId, choiceLabel]);

  // Force a refresh of items when component mounts to ensure categories are loaded
  useEffect(() => {
    console.log(`MenuItemsManager: Initial load for choice ${choiceId} (${choiceLabel})`);
    refetchMenuItems();
  }, [refetchMenuItems, choiceId, choiceLabel]);

  // Determine if this choice should use categories
  const useCategories = useMemo(() => {
    if (!choiceItems.length) return false;

    // Check if this is a known multi-category choice like buffet menu
    const choiceValue = choiceItems[0]?.choice;
    console.log(`Choice value for ${choiceLabel}: ${choiceValue}`);

    // Also check if it's a section-main choice
    const isSectionMain = choiceValue?.includes('sec-main') || 
                          choiceValue === 'sec-mains' || 
                          choiceValue?.startsWith('sec-');

    // Check the choice label for common multi-category types
    const isBuffetLabel = choiceLabel.toLowerCase().includes('buffet');
    const isKarooLabel = choiceLabel.toLowerCase().includes('karoo');
    const isSectionLabel = choiceLabel.toLowerCase().includes('section') || 
                           choiceLabel.toLowerCase().includes('main');

    const shouldUseCategories = MULTI_CATEGORY_CHOICE_VALUES.includes(choiceValue) || 
                                isBuffetLabel || 
                                isKarooLabel || 
                                isSectionMain || 
                                isSectionLabel;
                                
    console.log(`Should use categories for ${choiceLabel}? ${shouldUseCategories}`);
    return shouldUseCategories;
  }, [choiceItems, choiceLabel]);

  // Get available categories based on existing items in this choice
  const availableCategories = useMemo(() => {
    if (!useCategories || !choiceItems.length) return [];

    // Extract categories from choice items
    const categories = choiceItems.map(item => item.category).filter(Boolean) as string[];

    // Return unique categories
    return [...new Set(categories)];
  }, [choiceItems, useCategories]);

  // Handler for when "Add Item" is clicked within a category
  const handleAddInCategory = (category: string | null) => {
    console.log(`Adding item in category: ${category || 'none'}`);
    setSelectedCategory(category);
    setShowInlineForm(true);
  };

  // Handler for adding an item from the empty container
  const handleAddItemClick = () => {
    setSelectedCategory(null);
    setShowInlineForm(true);
  };
  
  return <div className="mt-2 my-[7px]">
      {isLoading ? <div className="text-center py-4 text-sm text-gray-500">Loading items...</div> : <>
          {choiceItems.length === 0 ? <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50 flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-gray-500">No items added yet</p>
              <Button size="sm" onClick={handleAddItemClick} className="mt-2">
                <PlusIcon className="h-3 w-3 mr-1.5" />
                Add Item
              </Button>
            </div> : <>
              {useCategories ? <MenuItemsByCategory 
                items={choiceItems} 
                onEdit={item => setEditingItem(item)} 
                onDelete={handleDeleteItem} 
                isDeleting={isDeleting} 
                onReorder={handleReorderItems}
                onAddItem={handleAddInCategory}
              /> : <MenuItemsTable 
                items={choiceItems} 
                onEdit={item => setEditingItem(item)} 
                onDelete={handleDeleteItem} 
                onReorder={reorderedItems => handleReorderItems(reorderedItems)} 
                isDeleting={isDeleting} 
                onAddItem={handleAddInCategory} 
              />}
            </>}
        </>}

      {/* Inline form for adding items */}
      {showInlineForm && <MenuItemInlineForm onSubmit={data => {
      handleAddItem({
        ...data,
        choice_id: choiceId
      });
      setShowInlineForm(false);
      setSelectedCategory(null);
    }} onCancel={() => {
      setShowInlineForm(false);
      setSelectedCategory(null);
    }} isSubmitting={isCreating} choiceId={choiceId} availableCategories={availableCategories} preSelectedCategory={selectedCategory} />}

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
