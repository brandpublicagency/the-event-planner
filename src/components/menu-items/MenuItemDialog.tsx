
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem, MenuItemFormData } from '@/api/menuItemsApi';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuItemFormData) => void;
  isSubmitting: boolean;
  initialData?: MenuItem;
  title: string;
  choiceId: string;
}

const formSchema = z.object({
  label: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  category: z.string().nullable().optional(),
  choice_id: z.string().min(1, "Choice is required"),
});

type FormValues = z.infer<typeof formSchema>;

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  title,
  choiceId,
}) => {
  const [categories, setCategories] = useState<string[]>([
    "MEAT SELECTION",
    "VEGETABLES",
    "STARCH SELECTION",
    "SALAD"
  ]);

  // Fetch existing categories from menu items
  const { data: existingCategories } = useQuery({
    queryKey: ['menu-categories', choiceId],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('category')
        .eq('choice_id', choiceId)
        .not('category', 'is', null);
      
      if (data) {
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        return uniqueCategories as string[];
      }
      return [];
    },
    enabled: open, // Only fetch when dialog is open
    staleTime: 0 // Always refetch when dialog opens
  });

  // Update categories when data loads
  useEffect(() => {
    if (existingCategories && existingCategories.length > 0) {
      // Combine default categories with existing ones, removing duplicates
      const defaultCategories = ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
      const allCategories = [...new Set([...defaultCategories, ...existingCategories])];
      setCategories(allCategories);
    }
  }, [existingCategories]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || '',
      value: initialData?.value || '',
      category: initialData?.category || null,
      choice_id: choiceId || initialData?.choice_id || '',
    },
  });

  // Auto-generate value from label for new items
  const label = form.watch('label');
  useEffect(() => {
    if (!initialData && label) {
      // Only auto-generate for new items, not when editing
      const generatedValue = label
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace multiple hyphens with a single one
        .trim();
      
      form.setValue('value', generatedValue);
    }
  }, [label, form, initialData]);

  // Determine if we need to show category selection 
  // Always show the field for now
  const showCategoryField = true;

  const handleSubmit = (values: FormValues) => {
    // Ensure all required fields are present
    const menuItemData: MenuItemFormData = {
      label: values.label,
      value: values.value,
      category: values.category || null,
      choice_id: choiceId || values.choice_id,
      image_url: null, // Keep this to maintain compatibility with the existing API
    };
    
    onSubmit(menuItemData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
                    <Input placeholder="Item name" {...field} />
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
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Auto-generated from name" 
                      {...field} 
                      className={!initialData ? "bg-gray-100" : ""}
                      readOnly={!initialData}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showCategoryField && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No category</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="choice_id"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input 
                      {...field} 
                      value={choiceId || field.value} 
                      type="hidden" 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
