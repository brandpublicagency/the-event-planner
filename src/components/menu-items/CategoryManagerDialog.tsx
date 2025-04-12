
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryManager from './CategoryManager';
import { useQueryClient } from '@tanstack/react-query';

interface CategoryManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  choiceId: string;
  choiceLabel: string;
}

const CategoryManagerDialog: React.FC<CategoryManagerDialogProps> = ({
  open,
  onOpenChange,
  choiceId,
  choiceLabel
}) => {
  const queryClient = useQueryClient();
  
  // Force a refresh of category data when dialog opens or closes
  useEffect(() => {
    const refreshCategories = () => {
      console.log("CategoryManagerDialog: Refreshing category data");
      
      // Use a timestamp to force cache invalidation
      const timestamp = Date.now();
      
      // Invalidate all related category queries with different patterns used across the app
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Also invalidate with timestamp to force refresh
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list', timestamp] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories', timestamp] });
      
      // Also invalidate the specific query for this choice
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
        queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
        
        // Timestamp versions
        queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId, timestamp] });
        queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId, timestamp] });
      }
    };
    
    // Refresh when dialog opens and closes
    console.log(`CategoryManagerDialog state changed: open=${open} for: ${choiceLabel} (${choiceId})`);
    refreshCategories();
    
    // Set up a periodic refresh while the dialog is open
    let intervalId: number | undefined;
    if (open) {
      intervalId = window.setInterval(() => {
        console.log("CategoryManagerDialog: Periodic category refresh");
        refreshCategories();
      }, 1000); // Refresh every second while dialog is open
    }
    
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [open, queryClient, choiceId, choiceLabel]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Categories for {choiceLabel}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CategoryManager choiceId={choiceId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryManagerDialog;
