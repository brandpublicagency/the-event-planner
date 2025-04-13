
import React, { useEffect } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CategoryContainer from '../category-components/CategoryContainer';
import AddItemButton from '../category-components/AddItemButton';
import { toast } from 'sonner';

interface BuffetMenuContainerProps {
  categories: string[];
  categorizedItems: Record<string, MenuItem[]>;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddItem?: (category: string | null) => void;
  handleDragEnd: (result: any) => void;
}

const BuffetMenuContainer: React.FC<BuffetMenuContainerProps> = ({
  categories,
  categorizedItems,
  onEdit,
  onDelete,
  isDeleting,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  handleDragEnd
}) => {
  // Check if this is a sec-mains menu by looking at any item's choice value
  // Use case-insensitive comparison to handle various formats
  const isSecMains = Object.values(categorizedItems).some(items => 
    items.some(item => {
      const choice = item?.choice?.toLowerCase?.() || '';
      return choice.includes('sec') && choice.includes('main');
    })
  );

  console.log('BuffetMenuContainer: isSecMains=', isSecMains);
  console.log('BuffetMenuContainer: categories=', categories);
  
  // First few items choices for debugging
  const firstFewChoices = Object.values(categorizedItems)
    .flatMap(items => items.slice(0, 3))
    .map(item => item?.choice || 'undefined')
    .filter(Boolean);
  
  console.log('BuffetMenuContainer: Sample choices=', firstFewChoices);
  
  // Always enable drag handles for category reordering
  const showDragHandles = true;
  
  // Show toast hint when component mounts if we have multiple categories
  useEffect(() => {
    if (categories.length > 1) {
      toast.info("Drag and drop categories to reorder them", { 
        duration: 5000,
        id: "category-drag-hint" 
      });
    }
  }, [categories.length]);
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="border border-gray-300 rounded-md p-4">
        <Droppable droppableId="categories" type="category">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="space-y-6"
            >
              {categories.map((category, index) => (
                <Draggable 
                  key={`category-draggable-${category}`} 
                  draggableId={`category-${category}`} 
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-gray-50 rounded-md border ${
                        snapshot.isDragging 
                          ? 'border-blue-400 shadow-lg' 
                          : 'border-gray-200'
                      } transition-all duration-200`}
                    >
                      <CategoryContainer
                        key={`category-container-${category}`}
                        category={category}
                        items={categorizedItems[category] || []}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isDeleting={isDeleting}
                        onEditCategory={onEditCategory}
                        onDeleteCategory={onDeleteCategory}
                        canReorder={!!onAddItem}
                        isBuffetCategory={true}
                        dragHandleProps={provided.dragHandleProps}
                        showDragHandle={showDragHandles}
                        noBorder={true}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        
        {/* Single Add Item button at the bottom of the container */}
        {onAddItem && (
          <div className="mt-4">
            <AddItemButton 
              onAddItem={onAddItem} 
              category={null} 
            />
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default BuffetMenuContainer;
