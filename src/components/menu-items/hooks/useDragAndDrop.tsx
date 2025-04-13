
import { useCallback } from 'react';
import { MenuItem } from '@/api/menuItemsApi';

interface UseDragAndDropProps {
  items: MenuItem[];
  onReorder?: (reorderedItems: MenuItem[]) => void;
}

export const useDragAndDrop = ({ items, onReorder }: UseDragAndDropProps) => {
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination || !onReorder) return;
    
    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    const sourceCategory = sourceDroppableId.replace('category-', '');
    const destinationCategory = destinationDroppableId.replace('category-', '');
    
    const reorderedItems = [...items];
    const draggedItem = reorderedItems.find(item => item.id === result.draggableId);
    
    if (!draggedItem) return;
    
    const filteredItems = reorderedItems.filter(item => item.id !== result.draggableId);
    
    if (sourceCategory !== destinationCategory) {
      draggedItem.category = destinationCategory === 'Uncategorized' ? null : destinationCategory;
    }
    
    const itemsInDestination = filteredItems.filter(
      item => (item.category || 'Uncategorized') === destinationCategory
    );
    
    let newIndex = result.destination.index;
    if (newIndex > itemsInDestination.length) {
      newIndex = itemsInDestination.length;
    }
    
    itemsInDestination.splice(newIndex, 0, draggedItem);
    
    const updatedItems = filteredItems
      .filter(item => (item.category || 'Uncategorized') !== destinationCategory)
      .concat(itemsInDestination);
    
    onReorder(updatedItems);
  }, [items, onReorder]);

  return { handleDragEnd };
};
