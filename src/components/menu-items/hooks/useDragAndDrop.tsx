
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
    
    // Category dragging is disabled - no implementation needed
    if (result.type === 'category') {
      console.log("Category dragging is disabled");
      toast.info("Category reordering is disabled. Categories are in a fixed order.");
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
  }, [items, onReorder]);

  return { handleDragEnd };
};
