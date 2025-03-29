
import { useState, useEffect } from "react";
import { MenuOption } from "@/hooks/useMenuOptions";

export const useMenuFormState = (initialOptions: MenuOption[]) => {
  const [options, setOptions] = useState<MenuOption[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState({ value: "", label: "" });
  const [editedOption, setEditedOption] = useState({ value: "", label: "" });

  // Initialize options from props
  useEffect(() => {
    console.log(`useMenuFormState: optionsData updated for ${initialOptions[0]?.category}:`, initialOptions);
    setOptions(initialOptions);
  }, [initialOptions]);

  const resetAddState = () => {
    setIsAdding(false);
    setNewOption({ value: "", label: "" });
  };

  const resetEditState = () => {
    setEditingId(null);
    setEditedOption({ value: "", label: "" });
  };

  return {
    // State
    options,
    setOptions,
    isAdding,
    setIsAdding,
    isSaving,
    setIsSaving,
    editingId,
    setEditingId,
    newOption,
    setNewOption,
    editedOption, 
    setEditedOption,
    // Actions
    resetAddState,
    resetEditState
  };
};
