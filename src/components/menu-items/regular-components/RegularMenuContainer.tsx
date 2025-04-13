
import React from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { DragDropContext } from '@hello-pangea/dnd';
import CategoryContainer from '../category-components/CategoryContainer';
import AddItemButton from '../category-components/AddItemButton';

interface RegularMenuContainerProps {
  categories: string[];
  categorizedItems: Record<string, MenuItem[]>;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onEditCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  onAddItem?: (category: string | null) => void;
  handleDragEnd: (result: any) => void;
  dragHandleProps?: any;
  showDragHandle?: boolean;
}

const RegularMenuContainer: React.FC<RegularMenuContainerProps> = ({
  categories,
  categorizedItems,
  onEdit,
  onDelete,
  isDeleting,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  handleDragEnd,
  dragHandleProps,
  showDragHandle = false
}) => {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="border border-dashed border-gray-300 rounded-md p-3">
        <div className="space-y-4">
          {categories.map(category => (
            <CategoryContainer
              key={category}
              category={category}
              items={categorizedItems[category]}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
              canReorder={!!onAddItem}
              dragHandleProps={dragHandleProps}
              showDragHandle={showDragHandle}
              isGroupedLayout={true}
            />
          ))}
        </div>
        
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

export default RegularMenuContainer;
