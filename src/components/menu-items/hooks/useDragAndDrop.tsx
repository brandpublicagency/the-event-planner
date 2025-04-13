
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
    if (!result.destination) {
      console.log("Drag cancelled - no destination");
      return;
    }
    
    // Log the drag event for debugging
    console.log("Drag end event:", {
      type: result.type,
      source: result.source,
      destination: result.destination,
      draggableId: result.draggableId,
      reason: result.reason
    });
    
    // Handle category reordering
    if (result.type === 'category' && onReorderCategories && categoryOrder && categoryOrder.length > 1) {
      try {
        console.log("Handling category drag end:", result);
        console.log("Current category order:", categoryOrder);
        
        // Make a copy of the current order for reordering
        const newCategoryOrder = [...categoryOrder];
        
        // Get the category name from the draggableId
        const categoryName = result.draggableId.replace('category-', '');
        console.log(`Moving category "${categoryName}" from index ${result.source.index} to ${result.destination.index}`);
        
        // Make sure the category exists in our order
        if (!newCategoryOrder.includes(categoryName)) {
          console.error(`Category "${categoryName}" not found in current order`, newCategoryOrder);
          toast.error(`Cannot reorder: Category "${categoryName}" not found`);
          return;
        }
        
        // Remove the item from its original position and insert at the new position
        const [movedCategory] = newCategoryOrder.splice(result.source.index, 1);
        newCategoryOrder.splice(result.destination.index, 0, movedCategory);
        
        console.log("New category order after reordering:", newCategoryOrder);
        
        // Call the reorder function with the new order
        onReorderCategories(newCategoryOrder);
        
        // Show success toast
        toast.success(`Moved "${movedCategory}" to position ${result.destination.index + 1}`);
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
