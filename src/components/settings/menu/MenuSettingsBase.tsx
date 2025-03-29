import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button onClick={handleAdd} disabled={isAdding} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAdding && (
            <TableRow>
              <TableCell>
                <Input
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  placeholder="Enter value (e.g. 'chicken_breast')"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  placeholder="Enter display label"
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button onClick={handleSaveNew} size="sm" variant="outline">
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                  <Button onClick={handleCancelAdd} size="sm" variant="outline">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          
          {options.map((option) => (
            <TableRow key={option.id}>
              <TableCell>
                {editingId === option.id ? (
                  <Input
                    value={editedOption.value}
                    onChange={(e) => setEditedOption({ ...editedOption, value: e.target.value })}
                  />
                ) : (
                  option.value
                )}
              </TableCell>
              <TableCell>
                {editingId === option.id ? (
                  <Input
                    value={editedOption.label}
                    onChange={(e) => setEditedOption({ ...editedOption, label: e.target.value })}
                  />
                ) : (
                  option.label
                )}
              </TableCell>
              <TableCell>
                {editingId === option.id ? (
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveEdit(option.id)} size="sm" variant="outline">
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(option)} size="sm" variant="outline">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button onClick={() => handleDelete(option.id)} size="sm" variant="outline">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {options.length === 0 && !isAdding && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                No menu items found. Click "Add Item" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MenuSettingsBase;
