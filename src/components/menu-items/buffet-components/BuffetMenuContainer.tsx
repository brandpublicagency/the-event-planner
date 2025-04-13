
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CategoryContainer from '../category-components/CategoryContainer';
import AddItemButton from '../category-components/AddItemButton';

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
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-gray-50 rounded-md border border-gray-200"
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
                        showDragHandle={true}
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
