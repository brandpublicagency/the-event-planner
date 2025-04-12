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
    if (open) {
      console.log(`CategoryManagerDialog opened for: ${choiceLabel} (${choiceId})`);

      // Immediately invalidate queries to force fresh data
      queryClient.invalidateQueries({
        queryKey: ['menu-categories-list']
      });
      queryClient.invalidateQueries({
        queryKey: ['menu-categories', choiceId]
      });
      queryClient.invalidateQueries({
        queryKey: ['menuItems', choiceId]
      });
    }
  }, [open, queryClient, choiceId, choiceLabel]);
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base font-medium text-gray-600">Manage Categories for {choiceLabel}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Always render the CategoryManager when the dialog is open */}
          {open && <CategoryManager choiceId={choiceId} />}
        </div>
      </DialogContent>
    </Dialog>;
};
export default CategoryManagerDialog;