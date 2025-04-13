
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

// All choices that should use the categorized layout with drag and drop functionality
const MULTI_CATEGORY_CHOICE_VALUES = [
  // Buffet menus
  'buffet-menu', 
  'cho-buffet',
  // Karoo feasts
  'warm-karoo-feast',
  'cho-feast',
  // Section mains (all main course options)
  'sec-mains',
  'sec-main',
  'sec-main-vegetarian',
  'sec-main-vegan',
  // Plated menu options
  'plated-menu',
  'plated-main'
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

  const useCategories = useMemo(() => {
    if (!choiceItems.length) return false;

    const choiceValue = choiceItems[0]?.choice;
    console.log(`Choice value for ${choiceLabel}: ${choiceValue}`);

    // Check if this is a main course item (section main)
    const isMainCourse = choiceValue?.includes('sec-main') || 
                          choiceValue === 'sec-mains' || 
                          choiceValue?.startsWith('sec-') ||
                          choiceValue === 'plated-menu' ||
                          choiceValue === 'plated-main';

    // Check if this is a feast or buffet item
    const isBuffetType = choiceValue === 'buffet-menu' || 
                         choiceValue === 'cho-buffet';
    const isKarooFeast = choiceValue === 'warm-karoo-feast' || 
                         choiceValue === 'cho-feast';

    // Check for menu type by label as backup
    const isBuffetLabel = choiceLabel.toLowerCase().includes('buffet');
    const isKarooLabel = choiceLabel.toLowerCase().includes('karoo');
    const isMainCourseLabel = choiceLabel.toLowerCase().includes('main course') || 
                              choiceLabel.toLowerCase().includes('section') || 
                              choiceLabel.toLowerCase().includes('plated');

    // Determine if we should use categories for this choice
    const shouldUseCategories = MULTI_CATEGORY_CHOICE_VALUES.includes(choiceValue) || 
                                isBuffetLabel || 
                                isKarooLabel || 
                                isMainCourse || 
                                isMainCourseLabel;
                                
    console.log(`Should use categories for ${choiceLabel}? ${shouldUseCategories}`);
    return shouldUseCategories;
  }, [choiceItems, choiceLabel]);

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

      <MenuItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={data => handleAddItem({
      ...data,
      choice_id: choiceId
    })} isSubmitting={isCreating} title="Add Menu Item" choiceId={choiceId} />

      {editingItem && <MenuItemDialog open={!!editingItem} onOpenChange={open => !open && setEditingItem(null)} onSubmit={data => handleUpdateItem(editingItem.id, data)} isSubmitting={isUpdating} initialData={editingItem} title="Edit Menu Item" choiceId={choiceId} />}
    </div>;
};

export default MenuItemsManager;
