
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MenuOption } from "@/hooks/useMenuOptions";

export const useMenuActions = (
  options: MenuOption[],
  setOptions: React.Dispatch<React.SetStateAction<MenuOption[]>>,
  category: string,
  onSave: (updatedOptions: MenuOption[]) => Promise<boolean>,
  resetAddState: () => void,
  resetEditState: () => void,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Validation helpers
  const isValueUnique = (value: string, excludeId?: string): boolean => {
    return !options.some(opt => 
      opt.value === value && (!excludeId || opt.id !== excludeId)
    );
  };

  const validateOption = (
    value: string, 
    label: string, 
    isNew: boolean, 
    id?: string
  ): boolean => {
    if (!value.trim() || !label.trim()) {
      toast.error("Both value and label are required");
      return false;
    }

    if ((isNew || (id && options.find(o => o.id === id)?.value !== value)) 
        && !isValueUnique(value, id)) {
      toast.error(`Option with value "${value}" already exists`);
      return false;
    }

    return true;
  };

  // Create a new menu option
  const createOption = async (value: string, label: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      
      // Create in Supabase
      const { data, error } = await supabase
        .from('menu_options')
        .insert([
          { type: value, name: label, category, price_type: 'standard' }
        ])
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("No data returned from insert operation");
      }

      // Transform to MenuOption format
      const newOption: MenuOption = {
        id: data[0].id,
        value: data[0].type,
        label: data[0].name,
        category: data[0].category
      };

      // Update local state
      setOptions([...options, newOption]);
      
      // Notify success
      toast.success("Option added successfully");
      
      // Notify parent component
      await onSave([...options, newOption]);
      
      return true;
    } catch (err: any) {
      console.error("Error creating menu option:", err);
      toast.error(`Failed to add option: ${err.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update an existing menu option
  const updateOption = async (
    id: string, 
    value: string, 
    label: string
  ): Promise<boolean> => {
    try {
      setIsSaving(true);
      setProcessingId(id);
      
      // Update in Supabase
      const { error } = await supabase
        .from('menu_options')
        .update({ 
          type: value, 
          name: label 
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const updatedOptions = options.map(opt => 
        opt.id === id 
          ? { ...opt, value, label } 
          : opt
      );
      
      setOptions(updatedOptions);
      
      // Notify success
      toast.success("Option updated successfully");
      
      // Notify parent component
      await onSave(updatedOptions);
      
      return true;
    } catch (err: any) {
      console.error("Error updating menu option:", err);
      toast.error(`Failed to update option: ${err.message}`);
      return false;
    } finally {
      setIsSaving(false);
      setProcessingId(null);
    }
  };

  // Delete a menu option
  const deleteOption = async (id: string): Promise<boolean> => {
    try {
      setProcessingId(id);
      
      // Delete from Supabase
      const { error } = await supabase
        .from('menu_options')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const filteredOptions = options.filter(opt => opt.id !== id);
      setOptions(filteredOptions);
      
      // Notify success
      toast.success("Option deleted successfully");
      
      // Notify parent component
      await onSave(filteredOptions);
      
      return true;
    } catch (err: any) {
      console.error("Error deleting menu option:", err);
      toast.error(`Failed to delete option: ${err.message}`);
      return false;
    } finally {
      setProcessingId(null);
    }
  };

  return {
    processingId,
    isValueUnique,
    validateOption,
    createOption,
    updateOption,
    deleteOption
  };
};
