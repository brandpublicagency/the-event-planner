
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useMenuItems } from '@/hooks/useMenuItems';
import MenuItemsTable from './MenuItemsTable';
import MenuItemDialog from './MenuItemDialog';
import { MenuItem } from '@/api/menuItemsApi';
import MenuItemInlineForm from './MenuItemInlineForm';

interface MenuItemsManagerProps {
  choiceId: string;
  choiceLabel: string;
  hideChoiceLabel?: boolean;
}

const MULTI_CATEGORY_CHOICE_VALUES = [
  'buffet-menu',
  'warm-karoo-feast',
  'plated-menu',
  'dessert-canapes',
  'individual-cakes',
  'baked-desserts'
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
    if (!choiceItems.length) {
      // Check choice value from the first item
      const choiceValue = choiceItems[0]?.choice;
      if (choiceValue) {
        return MULTI_CATEGORY_CHOICE_VALUES.includes(choiceValue);
      }
      
      // If no items yet, check the choice label for keywords
      const lowerLabel = choiceLabel.toLowerCase();
      return lowerLabel.includes('buffet') || 
             lowerLabel.includes('karoo') || 
             lowerLabel.includes('dessert');
    }
    
    // Check if this is a known multi-category choice like buffet menu
    const choiceValue = choiceItems[0]?.choice;
    return MULTI_CATEGORY_CHOICE_VALUES.includes(choiceValue);
  }, [choiceItems, choiceLabel]);

  // Determine the available categories based on the choice
  const availableCategories = useMemo(() => {
    if (!useCategories) return [];
    
    // Get choice value from first item or infer from label
    const choiceValue = choiceItems[0]?.choice || choiceLabel.toLowerCase().replace(/\s+/g, '-');
    
    if (choiceValue === 'buffet-menu' || choiceLabel.toLowerCase().includes('buffet')) {
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    }
    
    if (choiceValue === 'warm-karoo-feast' || choiceLabel.toLowerCase().includes('karoo')) {
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    }
    
    if (choiceValue === 'plated-menu' || choiceLabel.toLowerCase().includes('plated')) {
      return ["MAIN SELECTION", "SALAD"];
    }
    
    if (choiceValue === 'dessert-canapes' || choiceLabel.toLowerCase().includes('canape')) {
      return ["DESSERT CANAPÉS"];
    }
    
    if (choiceValue === 'individual-cakes' || choiceLabel.toLowerCase().includes('cake')) {
      return ["INDIVIDUAL CAKES"];
    }
    
    if (choiceValue === 'baked-desserts' || choiceLabel.toLowerCase().includes('baked')) {
      return ["BAKED DESSERTS"];
    }
    
    return [];
  }, [choiceItems, useCategories, choiceLabel]);

  // Handler for when "Add Item" is clicked within a category
  const handleAddInCategory = (category: string | null) => {
    setSelectedCategory(category);
    setShowInlineForm(true);
  };

  return (
    <div className="mt-2 border-l-2 border-gray-200 pl-3">
      {isLoading ? (
        <div className="text-center py-4 text-sm text-gray-500">Loading items...</div>
      ) : (
        <>
          {!hideChoiceLabel && (
            <div className="mb-2">
              <h6 className="text-sm font-medium">{choiceLabel}</h6>
            </div>
          )}
          
          <MenuItemsTable 
            items={choiceItems} 
            onEdit={item => setEditingItem(item)} 
            onDelete={handleDeleteItem} 
            onReorder={handleReorderItems} 
            isDeleting={isDeleting}
            useCategories={useCategories}
            availableCategories={availableCategories}
            onAddItem={handleAddInCategory}
          />
          
          {/* Add Item button */}
          {!showInlineForm && !useCategories && (
            <Button 
              size="sm" 
              onClick={() => setShowInlineForm(true)} 
              className="w-full mt-3 border border-dashed border-gray-200 bg-transparent hover:bg-gray-50 text-gray-500 hover:text-gray-700"
            >
              <span className="text-xs">+ Add Item</span>
            </Button>
          )}
          
          {/* Inline form for adding items */}
          {showInlineForm && (
            <MenuItemInlineForm 
              onSubmit={data => {
                handleAddItem({
                  ...data,
                  choice_id: choiceId,
                  category: selectedCategory
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
        </>
      )}

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
