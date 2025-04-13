
import { useCallback } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { toast } from "sonner";

interface UseDragAndDropProps {
  items: MenuItem[];
  onReorder?: (reorderedItems: MenuItem[]) => void;
  onReorderCategories?: (newCategoryOrder: string[]) => void;
  categoryOrder?: string[];
  choiceId?: string | null;
}

export const useDragAndDrop = ({ 
  items, 
  onReorder,
  onReorderCategories,
  categoryOrder = [],
  choiceId
}: UseDragAndDropProps) => {
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    // Handle category reordering
    if (result.type === 'category' && onReorderCategories && categoryOrder) {
      try {
        console.log("Handling category drag end:", result);
        console.log("Current category order:", categoryOrder);
        
        const newCategoryOrder = [...categoryOrder];
        const [movedCategory] = newCategoryOrder.splice(result.source.index, 1);
        newCategoryOrder.splice(result.destination.index, 0, movedCategory);
        
        console.log("New category order:", newCategoryOrder);
        onReorderCategories(newCategoryOrder);
        toast.success("Category order updated");
      } catch (error) {
        console.error("Error reordering categories:", error);
        toast.error("Failed to reorder categories");
      }
      return;
    }
    
    // Handle item reordering within categories
    if (!onReorder) return;
    
    try {
      const sourceDroppableId = result.source.droppableId;
      const destinationDroppableId = result.destination.droppableId;
      const sourceCategory = sourceDroppableId.replace('category-', '');
      const destinationCategory = destinationDroppableId.replace('category-', '');
      
      console.log(`Moving item from ${sourceCategory} to ${destinationCategory}`);
      
      const reorderedItems = [...items];
      const draggedItem = reorderedItems.find(item => item.id === result.draggableId);
      
      if (!draggedItem) {
        console.error("Dragged item not found:", result.draggableId);
        return;
      }
      
      const filteredItems = reorderedItems.filter(item => item.id !== result.draggableId);
      
      if (sourceCategory !== destinationCategory) {
        console.log(`Changing category from ${sourceCategory} to ${destinationCategory}`);
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
      toast.success("Items reordered successfully");
    } catch (error) {
      console.error("Error reordering items:", error);
      toast.error("Failed to reorder items");
    }
  }, [items, onReorder, onReorderCategories, categoryOrder]);

  return { handleDragEnd };
};
