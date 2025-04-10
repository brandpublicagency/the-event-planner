
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItemInlineFormProps {
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  choiceId: string;
  availableCategories?: string[];
}

const formSchema = z.object({
  label: z.string().min(1, "Name is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MenuItemInlineForm: React.FC<MenuItemInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  choiceId,
  availableCategories = [],
}) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: '',
      value: '',
      description: '',
      category: '',
    },
  });

  const selectedCategory = watch('category');
  const [categories, setCategories] = useState<string[]>(availableCategories);

  // Fetch existing categories from menu items
  const { data: existingCategories } = useQuery({
    queryKey: ['menu-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('category')
        .not('category', 'is', null);
      
      if (data) {
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        return uniqueCategories as string[];
      }
      return [];
    }
  });

  // Update categories when data loads
  useEffect(() => {
    if (existingCategories && existingCategories.length > 0) {
      // Combine provided categories with existing ones, removing duplicates
      const allCategories = [...new Set([...availableCategories, ...existingCategories])];
      setCategories(allCategories);
    }
  }, [existingCategories, availableCategories]);

  const onFormSubmit = (values: FormValues) => {
    // Send the form data to parent component
    const menuItemData: MenuItemFormData = {
      label: values.label,
      value: values.value,
      description: values.description || null,
      category: values.category || null,
      choice_id: choiceId,
      image_url: null, // Keep this to maintain compatibility with the existing API
    };
    
    onSubmit(menuItemData);
  };

  // Determine if we need to show category selection
  const showCategoryField = choiceId && categories.length > 0;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3 border rounded-md p-3 bg-zinc-50">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="label" className="block text-xs font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <Input
            id="label"
            placeholder="Item name"
            {...register('label')}
            className="text-xs"
          />
          {errors.label && (
            <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="value" className="block text-xs font-medium text-gray-700 mb-1">
            Value
          </label>
          <Input
            id="value"
            placeholder="Unique identifier"
            {...register('value')}
            className="text-xs"
          />
          {errors.value && (
            <p className="text-xs text-red-500 mt-1">{errors.value.message}</p>
          )}
        </div>
      </div>
      
      {showCategoryField && (
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select 
            onValueChange={(value) => setValue('category', value)} 
            value={selectedCategory || ''}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
              <SelectItem value="MEAT SELECTION">MEAT SELECTION</SelectItem>
              <SelectItem value="VEGETABLES">VEGETABLES</SelectItem>
              <SelectItem value="STARCH SELECTION">STARCH SELECTION</SelectItem>
              <SelectItem value="SALAD">SALAD</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <Textarea
          id="description"
          placeholder="Item description"
          {...register('description')}
          className="text-xs resize-none"
          rows={2}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-xs"
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemInlineForm;
