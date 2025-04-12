
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
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Also invalidate the specific query for this choice
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
        queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
        queryClient.invalidateQueries({ queryKey: ['menuItems', choiceId] });
      }
    };
    
    // Refresh when dialog opens
    if (open) {
      console.log(`CategoryManagerDialog opened for: ${choiceLabel} (${choiceId})`);
      refreshCategories();
    } else {
      // Refresh when dialog closes (to ensure parent components see updated data)
      console.log(`CategoryManagerDialog closed for: ${choiceLabel}`);
      refreshCategories();
    }
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
