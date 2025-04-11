
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { MenuItemFormData } from '@/api/menuItemsApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toSlug } from '@/utils/menuStructureUtils';

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
  const [formData, setFormData] = useState<MenuItemFormData>({
    label: '',
    value: '',
    category: preSelectedCategory || null,
    choice_id: choiceId,
    image_url: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-generate value from label
      if (name === 'label' && !prev.value) {
        updatedData.value = toSlug(value);
      }
      
      return updatedData;
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value || null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) {
      return;
    }
    
    onSubmit({
      ...formData,
      label: formData.label.trim(),
      value: formData.value.trim() || toSlug(formData.label),
    });
  };

  // Set preselected category when it changes
  useEffect(() => {
    if (preSelectedCategory !== null) {
      setFormData(prev => ({
        ...prev,
        category: preSelectedCategory
      }));
    }
  }, [preSelectedCategory]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border border-green-200 rounded-md p-3 bg-green-50 mb-4 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div className={availableCategories.length > 0 ? "sm:col-span-2" : "sm:col-span-3"}>
          <label className="block text-xs text-gray-600 mb-1">
            Item Name
          </label>
          <Input
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Roast Beef"
            required
            className="bg-white"
          />
          <div className="mt-2">
            <label className="block text-xs text-gray-600 mb-1">
              Value
            </label>
            <Input
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="e.g., roast-beef"
              className="bg-white"
            />
          </div>
        </div>
        
        {availableCategories.length > 0 && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Category
            </label>
            <Select
              value={formData.category || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Category</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        
        <Button 
          type="submit"
          size="sm"
          disabled={isSubmitting || !formData.label.trim()}
          className="flex items-center bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Add Item
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemInlineForm;
