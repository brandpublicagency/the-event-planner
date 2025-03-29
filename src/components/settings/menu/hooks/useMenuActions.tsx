
import { useState, useCallback } from 'react';
import { 
  createMenuOption, 
  updateMenuOption, 
  deleteMenuOption, 
  transformDbOptionToMenuOption,
  type MenuOptionFormData
} from '../services';
import { MenuOption } from "@/hooks/useMenuOptions";
import { toast } from "@/hooks/use-toast";

export interface UseMenuActionsProps {
  options: MenuOption[];
  setOptions: React.Dispatch<React.SetStateAction<MenuOption[]>>;
  category: string;
  onSave: (updatedOptions: MenuOption[]) => Promise<boolean>;
  resetAddState: () => void;
  resetEditState: () => void;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useMenuActions = (props: UseMenuActionsProps) => {
  const {
    options,
    setOptions,
    category,
    onSave,
    resetAddState,
    resetEditState,
    setIsSaving
  } = props;
  
  const [processingId, setProcessingId] = useState<string | null>(null);

  const validateOption = useCallback((value: string, label: string, isNew: boolean, editingId: string | null = null): boolean => {
    if (!value || !label) {
      toast.error('Both value and label are required');
      return false;
    }

    const existingOption = options.find(option => option.value === value && option.id !== editingId);
    if (existingOption) {
      toast.error(`Option with value "${value}" already exists`);
      return false;
    }

    return true;
  }, [options, toast]);

  const createOption = useCallback(async (value: string, label: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const isValid = validateOption(value, label, true);
      if (!isValid) {
        setIsSaving(false);
        return false;
      }

      const newOptionData: MenuOptionFormData = {
        name: label,
        type: value,
        category: category,
      };

      const createdOption = await createMenuOption(newOptionData);

      if (createdOption) {
        setOptions(prevOptions => [...prevOptions, createdOption]);
        resetAddState();
        await onSave([...options, createdOption]);
        return true;
      } else {
        toast.error('Failed to add option');
        return false;
      }
    } catch (error: any) {
      console.error('Error creating option:', error);
      toast.error(`Failed to add option: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateOption, setOptions, category, onSave, resetAddState, setIsSaving, options, toast]);

  const updateOption = useCallback(async (id: string, value: string, label: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const isValid = validateOption(value, label, false, id);
      if (!isValid) {
        setIsSaving(false);
        return false;
      }

      const success = await updateMenuOption(id, { name: label, type: value });

      if (success) {
        setOptions(prevOptions =>
          prevOptions.map(option =>
            option.id === id ? { ...option, value, label } : option
          )
        );
        resetEditState();
        await onSave(options.map(option =>
          option.id === id ? { ...option, value, label } : option
        ));
        return true;
      } else {
        toast.error('Failed to update option');
        return false;
      }
    } catch (error: any) {
      console.error('Error updating option:', error);
      toast.error(`Failed to update option: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateOption, setOptions, onSave, resetEditState, options, setIsSaving, toast]);

  const deleteOption = useCallback(async (id: string): Promise<boolean> => {
    setProcessingId(id);
    try {
      const success = await deleteMenuOption(id);

      if (success) {
        setOptions(prevOptions => prevOptions.filter(option => option.id !== id));
        await onSave(options.filter(option => option.id !== id));
        return true;
      } else {
        toast.error('Failed to delete option');
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting option:', error);
      toast.error(`Failed to delete option: ${error.message}`);
      return false;
    } finally {
      setProcessingId(null);
    }
  }, [setOptions, onSave, options, toast]);

  return {
    processingId,
    validateOption,
    createOption,
    updateOption,
    deleteOption
  };
};
