
import React from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import CategoryManagerDialog from './CategoryManagerDialog';
import DeleteCategoryDialog from './category-components/DeleteCategoryDialog';
import { useCategoryManager } from './hooks/useCategoryManager';
import { useMenuCategories } from './hooks/useMenuCategories';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import BuffetMenuContainer from './buffet-components/BuffetMenuContainer';
import RegularMenuContainer from './regular-components/RegularMenuContainer';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoveVertical } from 'lucide-react';

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
    customCategoryOrder
  } = useMenuCategories(items);
  
  const { handleDragEnd } = useDragAndDrop({ 
    items, 
    onReorder,
    onReorderCategories: updateCategoryOrder,
    categoryOrder: customCategoryOrder.length > 0 ? customCategoryOrder : allCategories
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
  const isCategoryReorderingEnabled = onReorder && allCategories.length > 1 && allCategories[0] !== 'Uncategorized';

  return (
    <>
      {isCategoryReorderingEnabled ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories" type="category">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                className="space-y-6"
              >
                {allCategories.map((category, index) => (
                  <Draggable 
                    key={category} 
                    draggableId={`cat-${category}`}
                    index={index}
                    isDragDisabled={category === 'Uncategorized'}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'opacity-70' : ''}`}
                      >
                        {isBuffetMenu ? (
                          <div className="relative">
                            {category !== 'Uncategorized' && (
                              <div 
                                {...provided.dragHandleProps} 
                                className="absolute -left-8 top-2 cursor-grab opacity-40 hover:opacity-100"
                              >
                                <MoveVertical className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <BuffetMenuContainer
                              categories={[category]}
                              categorizedItems={{[category]: categorizedItems[category]}}
                              onEdit={onEdit}
                              onDelete={onDelete}
                              isDeleting={isDeleting}
                              onEditCategory={handleEditCategory}
                              onDeleteCategory={handleDeleteCategory}
                              onAddItem={onAddItem}
                              handleDragEnd={handleDragEnd}
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            {category !== 'Uncategorized' && (
                              <div 
                                {...provided.dragHandleProps} 
                                className="absolute -left-8 top-2 cursor-grab opacity-40 hover:opacity-100"
                              >
                                <MoveVertical className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <RegularMenuContainer
                              categories={[category]}
                              categorizedItems={{[category]: categorizedItems[category]}}
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
        <div className="space-y-6">
          {allCategories.map(category => (
            <div key={category}>
              {isBuffetMenu ? (
                <BuffetMenuContainer
                  categories={[category]}
                  categorizedItems={{[category]: categorizedItems[category]}}
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
                  categories={[category]}
                  categorizedItems={{[category]: categorizedItems[category]}}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onAddItem={onAddItem}
                  handleDragEnd={handleDragEnd}
                />
              )}
            </div>
          ))}
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
