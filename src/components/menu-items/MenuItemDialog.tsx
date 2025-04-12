
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
    "MEAT SELECTION",
    "VEGETABLES",
    "STARCH SELECTION",
    "SALAD"
  ]);
  
  const queryClient = useQueryClient();

  // Generate a unique query key with timestamp to force refresh
  const categoryQueryTimestamp = Date.now();
  
  // Fix: Include choiceId in the query to get choice-specific categories
  // This was the root cause of categories not showing up in the dropdown
  const { data: existingCategories = [], isLoading: isLoadingCategories, refetch: refetchCategories } = useQuery({
    queryKey: ['menu-categories', choiceId, categoryQueryTimestamp],
    queryFn: async () => {
      console.log(`MenuItemDialog: Fetching categories for choice: ${choiceId} at timestamp ${categoryQueryTimestamp}`);
      
      // Query now properly filters by choice_id when available
      let query = supabase
        .from('menu_items')
        .select('category')
        .not('category', 'is', null);
      
      if (choiceId) {
        query = query.eq('choice_id', choiceId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
        return [];
      }
      
      if (data && Array.isArray(data)) {
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        console.log(`MenuItemDialog: Found ${uniqueCategories.length} categories for choice ${choiceId}:`, uniqueCategories);
        return uniqueCategories as string[];
      }
      return [];
    },
    enabled: open, // Only fetch when dialog is open
    staleTime: 0, // Always refetch when opened
    refetchInterval: 1000, // Increased refetch frequency to catch new categories faster
    refetchOnWindowFocus: true
  });

  const allCategories = React.useMemo(() => {
    // Combine default categories with existing ones, removing duplicates
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

  // Refetch categories when dialog opens
  useEffect(() => {
    if (open) {
      console.log("MenuItemDialog: Dialog opened, refetching categories");
      
      // Force immediate refresh
      refetchCategories();
      
      // Invalidate all category-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-list'] });
      
      // Specifically invalidate queries for this choice
      if (choiceId) {
        queryClient.invalidateQueries({ queryKey: ['menu-categories', choiceId] });
        queryClient.invalidateQueries({ queryKey: ['menu-categories-list', choiceId] });
      }
      
      // Also invalidate the menu items to ensure they're updated
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      
      // Set up periodic refresh while dialog is open
      const intervalId = setInterval(() => {
        console.log("MenuItemDialog: Periodic refresh");
        refetchCategories();
      }, 1000); // Reduce interval to catch changes faster
      
      return () => clearInterval(intervalId);
    }
  }, [open, refetchCategories, queryClient, choiceId]);

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

  // Always show the category field
  const showCategoryField = true;

  const handleSubmit = (values: FormValues) => {
    // Handle the special "no-category" case
    let categoryValue = values.category;
    if (categoryValue === "no-category") {
      categoryValue = null;
    }
    
    // Ensure all required fields are present
    const menuItemData: MenuItemFormData = {
      label: values.label,
      value: values.value,
      category: categoryValue,
      choice_id: choiceId || values.choice_id,
      image_url: null, // Keep this to maintain compatibility with the existing API
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
                      defaultValue={field.value || "no-category"}
                      value={field.value || "no-category"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white max-h-60">
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
