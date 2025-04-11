
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { MenuChoice, MenuChoiceFormData } from '@/api/menuItemsApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toSlug } from '@/utils/menuStructureUtils';

interface MenuChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MenuChoiceFormData) => void;
  isSubmitting: boolean;
  initialData?: MenuChoice;
  title: string;
  sectionId: string;
}

const MenuChoiceDialog: React.FC<MenuChoiceDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialData,
  title,
  sectionId
}) => {
  const isEditMode = !!initialData;
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MenuChoiceFormData>({
    defaultValues: initialData
      ? {
          label: initialData.label,
          value: initialData.value,
          section_id: initialData.section_id,
          display_order: initialData.display_order,
          choice_type: initialData.choice_type || 'menu'
        }
      : {
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
    if (isEditMode) return; // Don't auto-generate value in edit mode
    
    const label = e.target.value;
    setValue('label', label);
    
    // Generate kebab case value from label
    const value = toSlug(label);
    setValue('value', value);
  };
  
  const watchType = watch('choice_type');

  const handleFormSubmit = (data: MenuChoiceFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Edit the menu choice details'
              : 'Add a new menu choice to this section'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Display Name</Label>
              <Input
                id="label"
                {...register('label', { required: true })}
                onChange={handleLabelChange}
                placeholder="Choice display name"
              />
              {errors.label && <p className="text-xs text-red-500 mt-1">Display name is required</p>}
            </div>
            
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                {...register('value', { required: true })}
                placeholder="identifier-value"
                disabled={isEditMode}
                className={isEditMode ? "opacity-50" : ""}
              />
              {!isEditMode && (
                <p className="text-xs text-muted-foreground mt-1">
                  Value is auto-generated from the display name
                </p>
              )}
              {errors.value && <p className="text-xs text-red-500 mt-1">Value is required</p>}
            </div>
            
            <div>
              <Label htmlFor="choice_type">Choice Type</Label>
              <Select 
                value={watchType} 
                onValueChange={(value) => setValue('choice_type', value)}
              >
                <SelectTrigger>
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
                  ? 'Simple menu choice - select one item only' 
                  : watchType === 'multiselect'
                  ? 'Allow selecting multiple items from this choice'
                  : 'Add-on items, usually with additional costs'}
              </p>
            </div>
            
            <input type="hidden" {...register('section_id')} />
            <input type="hidden" {...register('display_order')} />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Saving...'
                  : 'Adding...'
                : isEditMode
                ? 'Save Changes'
                : 'Add Choice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuChoiceDialog;
