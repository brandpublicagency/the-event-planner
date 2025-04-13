
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import MenuItemCard from './MenuItemCard';
import AddItemButton from './AddItemButton';
import { MenuItem } from '@/api/menuItemsApi';

interface CategoryItemsDroppableProps {
  category: string;
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onAddItem?: (category: string | null) => void;
  canReorder?: boolean;
}

const CategoryItemsDroppable: React.FC<CategoryItemsDroppableProps> = ({
  category,
  items,
  onEdit,
  onDelete,
  isDeleting,
  onAddItem,
  canReorder = true
}) => {
  return (
    <Droppable droppableId={`category-${category}`} direction="vertical">
      {provided => (
        <div ref={provided.innerRef} className="space-y-2 mx-[6px] my-0 py-0">
          {items.map((item, index) => (
            <Draggable 
              key={item.id} 
              draggableId={item.id} 
              index={index} 
              isDragDisabled={!canReorder}
            >
              {(provided, snapshot) => (
                <MenuItemCard
                  item={item}
                  index={index}
                  provided={provided}
                  snapshot={snapshot}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                  isDragDisabled={!canReorder}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          
          {onAddItem && (
            <AddItemButton 
              onAddItem={onAddItem} 
              category={category !== 'Uncategorized' ? category : null} 
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

export default CategoryItemsDroppable;
