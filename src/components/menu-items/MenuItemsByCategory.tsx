
import React from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import CategoryManagerDialog from './CategoryManagerDialog';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import { useMenuCategories } from './hooks/useMenuCategories';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import BuffetMenuContainer from './buffet-components/BuffetMenuContainer';
import RegularMenuContainer from './regular-components/RegularMenuContainer';

interface MenuItemsByCategoryProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onReorder?: (reorderedItems: MenuItem[]) => void;
  onAddItem?: (category: string | null) => void;
}

const MenuItemsByCategory: React.FC<MenuItemsByCategoryProps> = ({
  items,
  onEdit,
  onDelete,
  isDeleting,
  onReorder,
  onAddItem
}) => {
  // Use our hooks to organize the component logic
  const { categorizedItems, isBuffetMenu, allCategories } = useMenuCategories(items);
  
  const { handleDragEnd } = useDragAndDrop({ 
    items, 
    onReorder 
  });

  // Use the category manager hook
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

  if (allCategories.length === 0) {
    return <p className="text-center py-4 text-sm text-gray-500">No items available</p>;
  }

  return (
    <>
      {isBuffetMenu ? (
        <BuffetMenuContainer
          categories={allCategories}
          categorizedItems={categorizedItems}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddItem={onAddItem}
          handleDragEnd={handleDragEnd}
        />
      ) : (
        <RegularMenuContainer
          categories={allCategories}
          categorizedItems={categorizedItems}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddItem={onAddItem}
          handleDragEnd={handleDragEnd}
        />
      )}
      
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
