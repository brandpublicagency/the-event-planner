
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { XIcon } from 'lucide-react';

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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MenuItemFormData>({
    defaultValues: {
      label: '',
      value: '',
      category: preSelectedCategory || null,
      choice_id: choiceId,
      display_order: 0
    }
  });

  const selectedCategory = watch('category');
  const showCategorySelect = availableCategories.length > 0;
  
  // Auto-generate value from label (kebab case)
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    setValue('label', label);
    
    // Generate kebab case value from label
    const value = label
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setValue('value', value);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded-md p-3 space-y-3 bg-white mt-2">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium">Add Item</h5>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="h-6 w-6"
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="label" className="text-xs">Display Name:</Label>
          <Input
            id="label"
            {...register('label', { required: true })}
            onChange={handleLabelChange}
            placeholder="Menu item name"
            className="h-8 text-sm"
          />
          {errors.label && <p className="text-xs text-red-500 mt-1">Display name is required</p>}
        </div>
        
        {showCategorySelect && (
          <div>
            <Label htmlFor="category" className="text-xs">Category:</Label>
            <Select
              value={selectedCategory || ''}
              onValueChange={(value) => setValue('category', value === '' ? null : value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <input type="hidden" {...register('choice_id')} />
        <input type="hidden" {...register('display_order')} />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onCancel} 
            className="h-7 text-xs"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSubmitting}
            className="h-7 text-xs"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MenuItemInlineForm;
