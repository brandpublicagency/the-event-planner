
import React, { useState, useCallback, useEffect } from "react";
import MenuOptionsTable from "./components/MenuOptionsTable";
import MenuHeader from "./components/MenuHeader";
import { MenuOption } from "@/hooks/useMenuOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MenuSettingsBaseProps {
  title: string;
  description: string;
  optionsData: MenuOption[];
  category: string;
  onSave: (updatedOptions: MenuOption[]) => Promise<boolean>;
}

const MenuSettingsBase: React.FC<MenuSettingsBaseProps> = ({
  title,
  description,
  optionsData,
  category,
  onSave,
}) => {
  const [options, setOptions] = useState<MenuOption[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [editedOption, setEditedOption] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Update local state when props change
  useEffect(() => {
    console.log(`MenuSettingsBase: optionsData updated for ${category}:`, optionsData);
    setOptions(optionsData || []);
  }, [optionsData, category]);

  // Add new option row
  const handleAddOption = useCallback(() => {
    console.log('Adding new option row');
    setIsAdding(true);
    setNewOption({ value: "", label: "" });
  }, []);

  // Save new option
  const handleSaveNew = useCallback(async () => {
    if (!newOption.value || !newOption.label) {
      toast({
        title: "Error",
        description: "Both value and label are required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates
    if (options.some(option => option.value === newOption.value)) {
      toast({
        title: "Error",
        description: "An option with this value already exists",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving new option to database:', {
        name: newOption.label,
        type: newOption.value,
        category
      });
      
      // Add to database
      const { data, error } = await supabase
        .from('menu_options')
        .insert({
          name: newOption.label,
          type: newOption.value,
          category: category,
          price_type: 'standard'
        })
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after insert');
      }

      // Transform the returned data to match MenuOption format
      const newMenuOption: MenuOption = {
        id: data[0].id,
        value: data[0].type,
        label: data[0].name,
        category: data[0].category
      };

      console.log('New option created:', newMenuOption);

      // Update local state
      const updatedOptions = [...options, newMenuOption];
      setOptions(updatedOptions);
      
      // Clear new option form
      setIsAdding(false);
      setNewOption({ value: "", label: "" });
      
      toast({
        title: "Success",
        description: "Option added successfully",
      });
    } catch (err: any) {
      console.error('Error saving new option:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to save option",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [newOption, options, category, toast]);

  // Cancel adding new option
  const handleCancelAdd = useCallback(() => {
    setIsAdding(false);
    setNewOption({ value: "", label: "" });
  }, []);

  // Handle change in new option form
  const handleNewOptionChange = useCallback((field: "value" | "label", value: string) => {
    setNewOption(prev => ({ ...prev, [field]: value }));
  }, []);

  // Start editing an option
  const handleEdit = useCallback((option: MenuOption) => {
    console.log('Editing option:', option);
    setEditingId(option.id);
    setEditedOption({ value: option.value, label: option.label });
  }, []);

  // Handle change in edited option form
  const handleEditChange = useCallback((field: "value" | "label", value: string) => {
    setEditedOption(prev => ({ ...prev, [field]: value }));
  }, []);

  // Cancel editing
  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  // Delete option
  const handleDeleteOption = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      console.log('Deleting option with ID:', id);
      
      const { error } = await supabase
        .from('menu_options')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Update local state
      setOptions(options.filter(option => option.id !== id));
      
      toast({
        title: "Success",
        description: "Option deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting option:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete option",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [options, toast]);

  // Save edited option
  const handleSaveEdit = useCallback(async (id: string) => {
    if (!editedOption.value || !editedOption.label) {
      toast({
        title: "Error",
        description: "Both value and label are required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates, excluding the current option
    if (options.some(option => option.value === editedOption.value && option.id !== id)) {
      toast({
        title: "Error",
        description: "An option with this value already exists",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Updating option with ID:', id, 'New values:', editedOption);
      
      // Update in database
      const { error } = await supabase
        .from('menu_options')
        .update({
          name: editedOption.label,
          type: editedOption.value
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update local state
      setOptions(options.map(option => 
        option.id === id 
          ? { ...option, value: editedOption.value, label: editedOption.label } 
          : option
      ));
      
      // Clear editing state
      setEditingId(null);
      
      toast({
        title: "Success",
        description: "Option updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating option:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update option",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [options, editedOption, toast]);

  console.log("MenuSettingsBase rendering with options:", options, "isAdding:", isAdding);

  return (
    <div className="space-y-6">
      <MenuHeader 
        title={title} 
        description={description} 
        onAdd={handleAddOption} 
        isAdding={isAdding || isSaving} 
      />

      <div className="border rounded-md">
        <MenuOptionsTable
          options={options}
          isAdding={isAdding}
          editingId={editingId}
          newOption={newOption}
          editedOption={editedOption}
          onEdit={handleEdit}
          onDelete={handleDeleteOption}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onSaveNew={handleSaveNew}
          onCancelAdd={handleCancelAdd}
          onNewOptionChange={handleNewOptionChange}
          onEditChange={handleEditChange}
          onAddItem={handleAddOption}
        />
      </div>
    </div>
  );
};

export default MenuSettingsBase;
