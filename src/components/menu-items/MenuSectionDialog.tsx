
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MenuSection, MenuSectionFormData } from '@/api/menuItemsApi';

const formSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  display_order: z.number().int().min(0, 'Order must be a positive number'),
});

type MenuSectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuSectionFormData) => void;
  isSubmitting?: boolean;
  initialData?: MenuSection;
  title: string;
};

const MenuSectionDialog: React.FC<MenuSectionDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialData,
  title,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: initialData?.value || '',
      label: initialData?.label || '',
      display_order: initialData?.display_order || 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as MenuSectionFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Section display name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (Unique ID)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="section_id" 
                      disabled={!!initialData} // Can't change value for existing sections
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      step={10}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuSectionDialog;
