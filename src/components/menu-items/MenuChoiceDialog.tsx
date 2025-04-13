
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
import { MenuChoice, MenuChoiceFormData } from '@/api/menuItemsApi';
import { useEffect } from 'react';

const formSchema = z.object({
  section_id: z.string().min(1, 'Section is required'),
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  display_order: z.number().int().min(0, 'Order must be a positive number'),
});

type MenuChoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuChoiceFormData) => void;
  isSubmitting?: boolean;
  initialData?: MenuChoice;
  title: string;
  sectionId: string;
};

const MenuChoiceDialog: React.FC<MenuChoiceDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialData,
  title,
  sectionId,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_id: initialData?.section_id || sectionId,
      value: initialData?.value || '',
      label: initialData?.label || '',
      display_order: initialData?.display_order || 0,
    },
  });

  // Watch the label field to automatically generate the value for new choices
  const labelValue = form.watch('label');
  
  // Update the value field when label changes - generate with cho- prefix
  useEffect(() => {
    if (labelValue && !initialData) {  // Only auto-generate for new choices
      // Create a value with the required prefix
      let generatedValue = labelValue.split(/\s+/)[0]; // Get first word
      generatedValue = generatedValue.substring(0, 8); // Limit to 8 chars
      generatedValue = generatedValue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, ''); // Remove special characters
      
      // Add the cho- prefix
      generatedValue = `cho-${generatedValue}`;
      
      form.setValue('value', generatedValue);
    }
  }, [labelValue, form, initialData]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values as MenuChoiceFormData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('section_id')} />
            
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Choice display name" />
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
                      placeholder="Auto-generated with cho- prefix" 
                      disabled={!!initialData} // Can't change value for existing choices
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

export default MenuChoiceDialog;
