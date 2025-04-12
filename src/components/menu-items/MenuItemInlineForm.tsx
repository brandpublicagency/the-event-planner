
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MenuItemInlineFormProps {
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  choiceId: string;
  availableCategories?: string[];
  preSelectedCategory?: string | null;
}

const MenuItemInlineForm: React.FC<MenuItemInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  choiceId,
  availableCategories = [],
  preSelectedCategory = null
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<MenuItemFormData>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(preSelectedCategory);

  // Fetch categories specific to this choice
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ['menu-categories-list', choiceId],
    queryFn: async () => {
      const { data } = await supabase
        .from('menu_items')
        .select('category')
        .eq('choice_id', choiceId)
        .not('category', 'is', null);
      
      if (data) {
        const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
        return uniqueCategories;
      }
      return [];
    },
    staleTime: 0 // Always refetch the data when this component mounts
  });

  // Effect to refetch categories when component mounts
  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  // Combine hardcoded categories with fetched ones
  const allCategories = [...new Set([...availableCategories, ...categories])].filter(Boolean);

  const submitWithCategory = (data: MenuItemFormData) => {
    onSubmit({
      ...data,
      category: selectedCategory,
      choice_id: choiceId
    });
  };

  return (
    <form onSubmit={handleSubmit(submitWithCategory)} className="space-y-3 mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
        <div className="flex-1">
          <Input 
            placeholder="Name" 
            {...register("label", { required: true })}
            className={errors.label ? "border-red-500" : ""}
          />
          {errors.label && <p className="text-red-500 text-xs mt-1">Name is required</p>}
        </div>
        
        <div className="flex-1">
          <Input 
            placeholder="Value (machine-readable ID)" 
            {...register("value", { required: true })}
            className={errors.value ? "border-red-500" : ""}
          />
          {errors.value && <p className="text-red-500 text-xs mt-1">Value is required</p>}
        </div>
      </div>
      
      {allCategories.length > 0 && (
        <div>
          <Select 
            value={selectedCategory || ""} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {allCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          onClick={onCancel} 
          variant="outline" 
          size="sm"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemInlineForm;
