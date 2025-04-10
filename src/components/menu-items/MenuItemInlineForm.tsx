
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const DEFAULT_CATEGORIES = [
  "MEAT SELECTION",
  "VEGETABLES",
  "STARCH SELECTION",
  "SALAD"
];

const MenuItemInlineForm: React.FC<MenuItemInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  choiceId,
  availableCategories = DEFAULT_CATEGORIES,
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
  // Only show for multi-category menu choices like buffet or karoo
  const showCategoryField = choiceId && (
    // This is where we'd check if the choice is a multi-category choice
    // For now, we're just showing it for all items as a simplification
    availableCategories.length > 0
  );

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
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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
