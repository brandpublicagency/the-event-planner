
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MenuHeader from "./components/MenuHeader";
import MenuOptionsTable from "./components/MenuOptionsTable";

export interface MenuOption {
  id: string;
  value: string;
  label: string;
  category: string;
}

interface MenuSettingsBaseProps {
  title: string;
  description: string;
  optionsData: MenuOption[];
  category: string;
  onSave?: (options: MenuOption[]) => Promise<boolean | void>;
}

const MenuSettingsBase: React.FC<MenuSettingsBaseProps> = ({
  title,
  description,
  optionsData,
  category,
  onSave
}) => {
  const [options, setOptions] = useState<MenuOption[]>(optionsData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState({ value: "", label: "" });
  const [editedOption, setEditedOption] = useState({ value: "", label: "" });
  const { toast } = useToast();
  
  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setNewOption({ value: "", label: "" });
  };
  
  const handleEdit = (option: MenuOption) => {
    setIsAdding(false);
    setEditingId(option.id);
    setEditedOption({ value: option.value, label: option.label });
  };
  
  const handleDelete = (id: string) => {
    const updatedOptions = options.filter(option => option.id !== id);
    setOptions(updatedOptions);
    
    toast({
      title: "Menu item deleted",
      description: "The menu item has been removed",
      duration: 2000
    });
    
    if (onSave) {
      onSave(updatedOptions).catch(error => {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive"
        });
      });
    }
  };
  
  const handleSaveNew = () => {
    if (!newOption.value || !newOption.label) {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const id = `${newOption.value.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    const updatedOptions = [
      ...options,
      {
        id,
        value: newOption.value,
        label: newOption.label,
        category
      }
    ];
    
    setOptions(updatedOptions);
    setIsAdding(false);
    setNewOption({ value: "", label: "" });
    
    toast({
      title: "Menu item added",
      description: "New menu item has been added",
      duration: 2000
    });
    
    if (onSave) {
      onSave(updatedOptions).catch(error => {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive"
        });
      });
    }
  };
  
  const handleSaveEdit = (id: string) => {
    if (!editedOption.value || !editedOption.label) {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedOptions = options.map(option => 
      option.id === id 
        ? { ...option, value: editedOption.value, label: editedOption.label }
        : option
    );
    
    setOptions(updatedOptions);
    setEditingId(null);
    setEditedOption({ value: "", label: "" });
    
    toast({
      title: "Menu item updated",
      description: "The menu item has been updated",
      duration: 2000
    });
    
    if (onSave) {
      onSave(updatedOptions).catch(error => {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive"
        });
      });
    }
  };
  
  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewOption({ value: "", label: "" });
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedOption({ value: "", label: "" });
  };
  
  const handleNewOptionChange = (field: "value" | "label", value: string) => {
    setNewOption(prev => ({ ...prev, [field]: value }));
  };
  
  const handleEditChange = (field: "value" | "label", value: string) => {
    setEditedOption(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-4">
      <MenuHeader 
        title={title}
        description={description}
        onAdd={handleAdd}
        isAdding={isAdding}
      />
      
      <MenuOptionsTable
        options={options}
        isAdding={isAdding}
        editingId={editingId}
        newOption={newOption}
        editedOption={editedOption}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onSaveNew={handleSaveNew}
        onCancelAdd={handleCancelAdd}
        onNewOptionChange={handleNewOptionChange}
        onEditChange={handleEditChange}
      />
    </div>
  );
};

export default MenuSettingsBase;
