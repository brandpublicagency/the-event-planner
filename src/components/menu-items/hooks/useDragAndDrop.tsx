
import { MenuItem } from '@/api/types/menuItems';
import { toast } from "sonner";

interface UseDragAndDropProps {
  items: MenuItem[];
  onReorder?: (reorderedItems: MenuItem[]) => void;
  categoryOrder?: string[];
  choiceId?: string | null;
}

/**
 * A simple stub that replaces the previous drag-and-drop functionality.
 * This exists only for compatibility with components that still expect this hook,
 * but all actual drag-and-drop functionality has been removed.
 */
export const useDragAndDrop = ({ 
  items, 
  onReorder,
  categoryOrder = [],
  choiceId
}: UseDragAndDropProps) => {
  
  // Return a no-op handler that just shows a message that drag-and-drop is disabled
  const handleDragEnd = () => {
    console.log("Drag and drop functionality has been disabled");
    toast.info("Drag and drop functionality has been disabled. Items are displayed in a fixed order.");
  };

  return { handleDragEnd };
};
