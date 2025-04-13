
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import CategoryManagerDialog from './CategoryManagerDialog';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import { useMenuCategories } from './hooks/useMenuCategories';
import BuffetMenuContainer from './buffet-components/BuffetMenuContainer';

interface MenuItemsByCategoryProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onAddItem?: (category: string | null) => void;
}

const MenuItemsByCategory: React.FC<MenuItemsByCategoryProps> = ({
  items,
  onEdit,
  onDelete,
  isDeleting,
  onAddItem
}) => {
  const { 
    categorizedItems, 
    isBuffetMenu, 
    allCategories,
    customCategoryOrder,
    choiceId,
    isLoadingCategoryOrder
  } = useMenuCategories(items);
  
  // Enhanced debug logging
  console.log('MenuItemsByCategory:', {
    isBuffetMenu,
    allCategories: allCategories,
    customCategoryOrder: customCategoryOrder,
    choiceId,
    itemsCount: items.length,
    firstItemChoice: items[0]?.choice,
    firstItemID: items[0]?.id,
    categoriesCount: Object.keys(categorizedItems).length
  });

  const {
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    selectedChoiceId,
    selectedChoiceLabel,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    categoryToDelete,
    isDeleting: isDeletingCategory,
    handleEditCategory,
    handleDeleteCategory,
    performDelete
  } = useCategoryManager({ items });

  if (isLoadingCategoryOrder) {
    return <p className="text-center py-4 text-sm text-gray-500">Loading categories...</p>;
  }

  if (allCategories.length === 0) {
    return <p className="text-center py-4 text-sm text-gray-500">No items available</p>;
  }

  return (
    <>
      <BuffetMenuContainer
        categories={customCategoryOrder}
        categorizedItems={categorizedItems}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddItem={onAddItem}
      />
      
      {selectedChoiceId && (
        <CategoryManagerDialog 
          open={isCategoryManagerOpen} 
          onOpenChange={setIsCategoryManagerOpen} 
          choiceId={selectedChoiceId} 
          choiceLabel={selectedChoiceLabel} 
        />
      )}
      
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        categoryToDelete={categoryToDelete}
        isDeleting={isDeletingCategory}
        onConfirmDelete={performDelete}
      />
    </>
  );
};

export default MenuItemsByCategory;
