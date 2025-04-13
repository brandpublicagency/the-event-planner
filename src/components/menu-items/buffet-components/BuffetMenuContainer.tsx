
import React from 'react';
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
  // Check if this is a sec-mains menu by looking at the first item's choice value
  // Use trimming and case-insensitive comparison to handle possible format variations
  const isSecMains = categorizedItems && 
    Object.values(categorizedItems).length > 0 && 
    Object.values(categorizedItems).some(items => 
      items.length > 0 && 
      items[0]?.choice?.trim?.()?.toLowerCase?.() === 'sec-mains'
    );

  console.log('BuffetMenuContainer: isSecMains=', isSecMains);
  console.log('BuffetMenuContainer: categories=', categories);
  console.log('BuffetMenuContainer: First item choice=', 
    Object.values(categorizedItems)[0]?.[0]?.choice || 'No items');
  
  // Force show drag handles for testing - comment this out in production
  // const isSecMains = true;
  
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
                  isDragDisabled={!isSecMains}
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
                        showDragHandle={isSecMains}
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
