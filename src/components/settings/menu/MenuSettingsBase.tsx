
import React, { useState, useCallback } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MenuOptionRow from "./components/MenuOptionRow";
import AddOptionRow from "./components/AddOptionRow";
import MenuHeader from "./components/MenuHeader";
import { MenuOption } from "@/hooks/useMenuOptions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "./components/EmptyState";

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
  const [options, setOptions] = useState<MenuOption[]>(optionsData);
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState<{ value: string; label: string }>({
    value: "",
    label: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Add new option row
  const handleAddOption = useCallback(() => {
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

      if (error) throw error;

      // Transform the returned data to match MenuOption format
      const newMenuOption: MenuOption = {
        id: data[0].id,
        value: data[0].type,
        label: data[0].name,
        category: data[0].category
      };

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

  // Delete option
  const handleDeleteOption = useCallback(async (id: string) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('menu_options')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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

  // Edit option
  const handleEditOption = useCallback(async (id: string, updatedOption: { value: string; label: string }) => {
    if (!updatedOption.value || !updatedOption.label) {
      toast({
        title: "Error",
        description: "Both value and label are required",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicates, excluding the current option
    if (options.some(option => option.value === updatedOption.value && option.id !== id)) {
      toast({
        title: "Error",
        description: "An option with this value already exists",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update in database
      const { error } = await supabase
        .from('menu_options')
        .update({
          name: updatedOption.label,
          type: updatedOption.value
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setOptions(options.map(option => 
        option.id === id 
          ? { ...option, value: updatedOption.value, label: updatedOption.label } 
          : option
      ));
      
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
  }, [options, toast]);

  return (
    <div className="space-y-6">
      <MenuHeader 
        title={title} 
        description={description} 
        onAdd={handleAddOption} 
        isAdding={isAdding || isSaving} 
      />

      {options.length === 0 && !isAdding ? (
        <EmptyState 
          title="No options configured" 
          description="Add your first menu option to get started" 
          onAdd={handleAddOption} 
        />
      ) : (
        <Table className="border rounded-md">
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-1/3">Value</TableHead>
              <TableHead className="w-1/2">Display Label</TableHead>
              <TableHead className="w-1/6 text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.map((option) => (
              <MenuOptionRow
                key={option.id}
                option={option}
                onDelete={() => handleDeleteOption(option.id)}
                onEdit={(updatedOption) => handleEditOption(option.id, updatedOption)}
                disabled={isSaving}
              />
            ))}
            {isAdding && (
              <AddOptionRow
                newOption={newOption}
                onSaveNew={handleSaveNew}
                onCancelAdd={handleCancelAdd}
                onNewOptionChange={handleNewOptionChange}
              />
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MenuSettingsBase;
