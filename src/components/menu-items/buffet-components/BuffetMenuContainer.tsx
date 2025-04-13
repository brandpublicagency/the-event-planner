
import React from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { DragDropContext } from '@hello-pangea/dnd';
import CategoryContainer from '../category-components/CategoryContainer';

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
  dragHandleProps?: any;
  showDragHandle?: boolean;
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
  handleDragEnd,
  dragHandleProps,
  showDragHandle = false
}) => {
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {categories.map(category => (
          <CategoryContainer
            key={category}
            category={category}
            items={categorizedItems[category] || []}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
            onAddItem={onAddItem}
            isBuffetCategory={true}
            showAddItemButton={category === 'Uncategorized'}
            dragHandleProps={dragHandleProps}
            showDragHandle={showDragHandle}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default BuffetMenuContainer;
