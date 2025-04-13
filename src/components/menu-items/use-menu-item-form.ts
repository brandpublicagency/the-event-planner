
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemFormSchema, MenuItemFormValues } from './menu-item-form-schema';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemFormData } from '@/api/menuItemsApi';
import { toast } from 'sonner';

interface UseMenuItemFormProps {
  initialData?: MenuItem;
  choiceId: string;
  onSubmit: (data: MenuItemFormData) => void;
  open: boolean;
}

export const useMenuItemForm = ({
  initialData,
  choiceId,
  onSubmit,
  open
}: UseMenuItemFormProps) => {
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

  const allCategories = existingCategories || [];

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
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

  useEffect(() => {
    if (initialData) {
      form.reset({
        label: initialData.label,
        value: initialData.value,
        category: initialData.category,
        choice_id: initialData.choice_id,
      });
    }
  }, [initialData, form]);

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
  }, [open, queryClient, choiceId, initialData, form]);

  const handleSubmit = (values: MenuItemFormValues) => {
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

  return {
    form,
    allCategories,
    isLoadingCategories,
    handleSubmit
  };
};
