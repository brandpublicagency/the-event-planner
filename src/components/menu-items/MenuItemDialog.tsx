
import React from 'react';
import { MenuItem, MenuItemFormData } from '@/api/menuItemsApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMenuItemForm } from './use-menu-item-form';
import { MenuItemFormFields } from './menu-item-form-fields';

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuItemFormData) => void;
  isSubmitting: boolean;
  initialData?: MenuItem;
  title: string;
  choiceId: string;
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  title,
  choiceId,
}) => {
  const { 
    form, 
    allCategories, 
    isLoadingCategories, 
    handleSubmit 
  } = useMenuItemForm({
    initialData,
    choiceId,
    onSubmit,
    open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <MenuItemFormFields 
              form={form}
              categories={allCategories}
              isLoadingCategories={isLoadingCategories}
              initialData={initialData}
              choiceId={choiceId}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
