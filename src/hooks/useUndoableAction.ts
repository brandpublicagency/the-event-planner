import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface UndoableAction<T> {
  action: () => Promise<void>;
  undo: () => Promise<void>;
  data: T;
}

interface UseUndoableActionOptions {
  undoWindowMs?: number;
  onUndo?: () => void;
}

export function useUndoableAction<T>(options: UseUndoableActionOptions = {}) {
  const { undoWindowMs = 5000, onUndo } = options;
  const [pendingUndo, setPendingUndo] = useState<UndoableAction<T> | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const executeWithUndo = useCallback(
    async (
      action: () => Promise<void>,
      undo: () => Promise<void>,
      data: T,
      successMessage: string
    ) => {
      // Clear any existing undo timeout
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }

      // Execute the action
      await action();

      // Store the undo action
      const undoableAction: UndoableAction<T> = { action, undo, data };
      setPendingUndo(undoableAction);

      // Show toast with undo button
      const toastId = toast.success(successMessage, {
        duration: undoWindowMs,
        action: {
          label: 'Undo',
          onClick: async () => {
            try {
              await undo();
              setPendingUndo(null);
              if (undoTimeoutRef.current) {
                clearTimeout(undoTimeoutRef.current);
              }
              if (onUndo) {
                onUndo();
              }
              toast.info('Action undone');
            } catch (error) {
              console.error('Error undoing action:', error);
              toast.error('Failed to undo action');
            }
          },
        },
      });

      // Auto-clear after undo window expires
      undoTimeoutRef.current = setTimeout(() => {
        setPendingUndo(null);
      }, undoWindowMs);
    },
    [undoWindowMs, onUndo]
  );

  return {
    executeWithUndo,
    pendingUndo,
  };
}
