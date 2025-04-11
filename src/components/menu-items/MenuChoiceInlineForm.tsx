
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Save, X } from 'lucide-react';
import { MenuChoiceFormData } from '@/api/menuItemsApi';
import { toSlug } from '@/utils/menuStructureUtils';

interface MenuChoiceInlineFormProps {
  onSubmit: (data: MenuChoiceFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  sectionId: string;
}

const MenuChoiceInlineForm: React.FC<MenuChoiceInlineFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  sectionId
}) => {
  const [formData, setFormData] = useState<MenuChoiceFormData>({
    section_id: sectionId,
    label: '',
    value: '',
    display_order: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Auto-generate value from label if value is empty
      if (name === 'label' && !prev.value) {
        updatedData.value = toSlug(value);
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.label.trim()) {
      return;
    }
    
    onSubmit({
      ...formData,
      label: formData.label.trim(),
      value: formData.value.trim() || toSlug(formData.label),
      display_order: typeof formData.display_order === 'number' 
        ? formData.display_order 
        : parseInt(formData.display_order as unknown as string) || 0
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border border-blue-200 rounded-md p-3 bg-blue-50 mb-4 shadow-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Choice Name
          </label>
          <Input
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Buffet Menu"
            required
            className="bg-white"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Value
          </label>
          <Input
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="e.g., buffet-menu"
            className="bg-white"
          />
        </div>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Display Order
          </label>
          <Input
            name="display_order"
            type="number"
            min={0}
            value={formData.display_order}
            onChange={handleChange}
            placeholder="0"
            className="bg-white"
          />
        </div>
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
          className="flex items-center bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              Add Choice
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MenuChoiceInlineForm;
