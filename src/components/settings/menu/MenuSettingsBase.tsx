
import React, { useState, useEffect } from "react";
import { useMenuOptionsForm } from "./hooks/useMenuOptionsForm";
import MenuOptionsTable from "./components/MenuOptionsTable";
import MenuHeader from "./components/MenuHeader";
import { MenuOption } from "@/hooks/useMenuOptions";

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
  const { 
    options,
    isAdding,
    editingId,
    newOption,
    editedOption,
    isSaving,
    handleAddOption,
    handleSaveNew,
    handleCancelAdd,
    handleNewOptionChange,
    handleEdit,
    handleEditChange,
    handleCancelEdit,
    handleDeleteOption,
    handleSaveEdit
  } = useMenuOptionsForm(optionsData, category, onSave);

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
