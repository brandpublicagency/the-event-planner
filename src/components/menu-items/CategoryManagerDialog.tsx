
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryManager from './CategoryManager';

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
