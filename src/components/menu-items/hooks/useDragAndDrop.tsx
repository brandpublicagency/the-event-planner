
import { useCallback, useEffect } from 'react';
import { MenuItem } from '@/api/menuItemsApi';
import { storeCategoryOrder } from '@/api/menu/menuItemsApi';

interface UseDragAndDropProps {
  items: MenuItem[];
  onReorder?: (reorderedItems: MenuItem[]) => void;
  onReorderCategories?: (newCategoryOrder: string[]) => void;
  categoryOrder?: string[];
  choiceId?: string;
}

export const useDragAndDrop = ({ 
  items, 
  onReorder,
  onReorderCategories,
  categoryOrder,
  choiceId
}: UseDragAndDropProps) => {
  // Save category order to database when it changes
  useEffect(() => {
    if (choiceId && categoryOrder && categoryOrder.length > 1) {
      console.log(`Persisting category order for choice ${choiceId}:`, categoryOrder);
      storeCategoryOrder(choiceId, categoryOrder)
        .then(success => {
          if (success) {
            console.log('Category order saved successfully');
          } else {
            console.error('Failed to save category order');
          }
        })
        .catch(error => {
          console.error('Error saving category order:', error);
        });
    }
  }, [categoryOrder, choiceId]);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    // Handle category reordering
    if (result.type === 'category' && onReorderCategories && categoryOrder) {
      const newCategoryOrder = [...categoryOrder];
      const [movedCategory] = newCategoryOrder.splice(result.source.index, 1);
      newCategoryOrder.splice(result.destination.index, 0, movedCategory);
      
      console.log("Reordering categories:", newCategoryOrder);
      onReorderCategories(newCategoryOrder);
      return;
    }
    
    // Handle item reordering (existing functionality)
    if (!onReorder) return;
    
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
  }, [items, onReorder, onReorderCategories, categoryOrder]);

  return { handleDragEnd };
};
