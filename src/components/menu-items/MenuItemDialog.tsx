
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MenuItemForm from './MenuItemForm';
import { MenuItem, MenuItemFormData } from '@/api/menuItemsApi';

type MenuItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuItemFormData) => void;
  isSubmitting?: boolean;
  initialData?: MenuItem;
  title: string;
};

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialData,
  title,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MenuItemForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
