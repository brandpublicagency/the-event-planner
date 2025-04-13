import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import CategoryManagerDialog from './CategoryManagerDialog';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import { useMenuCategories } from './hooks/useMenuCategories';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import BuffetMenuContainer from './buffet-components/BuffetMenuContainer';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddItemButton from './category-components/AddItemButton';
import CategoryContainer from './category-components/CategoryContainer';

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

  const isCategoryReorderingEnabled = onReorder && customCategoryOrder.length > 1 && customCategoryOrder[0] !== 'Uncategorized';

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
                className="border border-dashed border-gray-300 rounded-md p-3"
              >
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
                        className="mb-4 last:mb-0"
                      >
                        <CategoryContainer
                          category={category}
                          items={categorizedItems[category] || []}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          isDeleting={isDeleting}
                          onEditCategory={handleEditCategory}
                          onDeleteCategory={handleDeleteCategory}
                          dragHandleProps={provided.dragHandleProps}
                          showDragHandle={true}
                          noBorder={true}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {onAddItem && (
                  <div className="mt-4">
                    <AddItemButton 
                      onAddItem={onAddItem} 
                      category={null} 
                    />
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div>
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
