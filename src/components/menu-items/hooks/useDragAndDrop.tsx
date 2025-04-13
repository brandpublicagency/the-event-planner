
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
export const useDragAndDrop = () => {
  // Return a no-op handler
  const handleDragEnd = () => {
    // Do nothing
  };

  return { handleDragEnd };
};
