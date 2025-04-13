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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
  const [defaultCategories] = useState<string[]>([
    "MEAT SELECTION"
  ]);
  
  const queryClient = useQueryClient();
  
  const stableId = initialData?.id || 'new';
  const queryKey = ['menu-categories', choiceId, stableId];
  
  const { data: existingCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      console.log(`MenuItemDialog: Fetching categories for choice: ${choiceId} with item: ${stableId}`);
      
      const { data, error } = await supabase
        .from('menu_items')
        .select('category')
        .eq('choice_id', choiceId)
        .not('category', 'is', null);
      
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        return [];
      }
      
      if (data && Array.isArray(data)) {
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        console.log(`MenuItemDialog: Found ${uniqueCategories.length} categories for choice ${choiceId}:`, uniqueCategories);
        return uniqueCategories as string[];
      }
      return [];
    },
    staleTime: 30000,
    enabled: open,
  });

  const allCategories = React.useMemo(() => {
    const combinedCategories = [...defaultCategories];
    
    if (existingCategories && existingCategories.length > 0) {
      existingCategories.forEach(category => {
        if (!combinedCategories.includes(category)) {
          combinedCategories.push(category);
        }
      });
    }
    
    console.log("MenuItemDialog: Combined categories:", combinedCategories);
    return combinedCategories;
  }, [defaultCategories, existingCategories]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        label: initialData.label,
        value: initialData.value,
        category: initialData.category,
        choice_id: initialData.choice_id,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (open) {
      console.log("MenuItemDialog: Dialog opened, prefetching categories");
      
      queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
      
      if (initialData) {
        form.reset({
          label: initialData.label,
          value: initialData.value,
          category: initialData.category,
          choice_id: initialData.choice_id,
        });
      }
    }
  }, [open, queryClient, choiceId, initialData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || '',
      value: initialData?.value || '',
      category: initialData?.category || null,
      choice_id: choiceId || initialData?.choice_id || '',
    },
  });

  const label = form.watch('label');
  useEffect(() => {
    if (!initialData && label) {
      let generatedValue = label.split(/\s+/)[0];
      generatedValue = generatedValue.substring(0, 8);
      generatedValue = generatedValue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      generatedValue = `itm-${generatedValue}`;
      
      form.setValue('value', generatedValue);
    }
  }, [label, form, initialData]);

  const showCategoryField = true;

  const handleSubmit = (values: FormValues) => {
    let categoryValue = values.category;
    if (categoryValue === "no-category") {
      categoryValue = null;
    }
    
    const menuItemData: MenuItemFormData = {
      label: values.label,
      value: values.value,
      category: categoryValue,
      choice_id: choiceId || values.choice_id,
      image_url: null,
    };
    
    console.log("Submitting menu item:", menuItemData);
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
                      placeholder="Auto-generated with itm- prefix" 
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
                      defaultValue={field.value || "no-category"}
                      value={field.value || "no-category"}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60 z-50">
                        <SelectItem value="no-category">No category</SelectItem>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Loading categories...</span>
                          </div>
                        ) : allCategories.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">No categories found</div>
                        ) : (
                          allCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))
                        )}
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
