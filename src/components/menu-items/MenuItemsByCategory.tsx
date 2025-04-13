
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import CategoryManagerDialog from './CategoryManagerDialog';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import { useMenuCategories } from './hooks/useMenuCategories';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import BuffetMenuContainer from './buffet-components/BuffetMenuContainer';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
  const { 
    categorizedItems, 
    isBuffetMenu, 
    allCategories,
    updateCategoryOrder,
    customCategoryOrder,
    choiceId
  } = useMenuCategories(items);
  
  const { handleDragEnd } = useDragAndDrop({ 
    items, 
    onReorder,
    onReorderCategories: updateCategoryOrder,
    categoryOrder: customCategoryOrder,
    choiceId
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

  // Determine if category reordering is enabled
  const isCategoryReorderingEnabled = onReorder && customCategoryOrder.length > 1 && customCategoryOrder[0] !== 'Uncategorized';

  // Log current category order for debugging
  console.log("MenuItemsByCategory - Current category order:", customCategoryOrder);
  console.log("MenuItemsByCategory - Category reordering enabled:", isCategoryReorderingEnabled);

  return (
    <>
      {isCategoryReorderingEnabled ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
              >
                {/* Use Draggable components for each category */}
                {customCategoryOrder.map((category, index) => (
                  <Draggable 
                    key={`category-${category}`} 
                    draggableId={`category-${category}`} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <BuffetMenuContainer
                          categories={[category]}
                          categorizedItems={categorizedItems}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          isDeleting={isDeleting}
                          onEditCategory={handleEditCategory}
                          onDeleteCategory={handleDeleteCategory}
                          onAddItem={onAddItem}
                          handleDragEnd={handleDragEnd}
                          showDragHandle={true}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div>
          {/* Always use BuffetMenuContainer for consistent drag and drop behavior */}
          <BuffetMenuContainer
            categories={customCategoryOrder}
            categorizedItems={categorizedItems}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddItem={onAddItem}
            handleDragEnd={handleDragEnd}
          />
        </div>
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
