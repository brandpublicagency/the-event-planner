
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { MenuChoiceFormData } from '@/api/menuItemsApi';
import { X } from 'lucide-react';
import { toSlug } from '@/utils/menuStructureUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MenuChoiceFormData>({
    defaultValues: {
      label: '',
      value: '',
      section_id: sectionId,
      display_order: 0,
      choice_type: 'menu'
    }
  });
  
  const choiceTypeOptions = [
    { label: 'Menu Choice', value: 'menu' },
    { label: 'Add-on Item', value: 'addon' },
    { label: 'Multi-select', value: 'multiselect' }
  ];
  
  // Auto-generate value from label (kebab case)
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    setValue('label', label);
    
    // Generate kebab case value from label
    const value = toSlug(label);
    setValue('value', value);
  };
  
  const watchType = watch('choice_type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded-md p-3 space-y-3 bg-white mt-2">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm font-medium">Add Choice</h5>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={onCancel} 
          className="h-6 w-6"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="label" className="text-xs">Display Name:</Label>
          <Input
            id="label"
            {...register('label', { required: true })}
            onChange={handleLabelChange}
            placeholder="Choice display name"
            className="h-8 text-sm"
          />
          {errors.label && <p className="text-xs text-red-500 mt-1">Display name is required</p>}
        </div>
        
        <div>
          <Label htmlFor="choice_type" className="text-xs">Choice Type:</Label>
          <Select 
            value={watchType} 
            onValueChange={(value) => setValue('choice_type', value)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select choice type" />
            </SelectTrigger>
            <SelectContent>
              {choiceTypeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {watchType === 'menu' 
              ? 'Simple menu choice' 
              : watchType === 'multiselect'
              ? 'Allow multiple selections'
              : 'Add-on items, with costs'}
          </p>
        </div>
        
        <input type="hidden" {...register('section_id')} />
        <input type="hidden" {...register('display_order')} />
        <input type="hidden" {...register('value')} />
        
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
            {isSubmitting ? 'Adding...' : 'Add Choice'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MenuChoiceInlineForm;
