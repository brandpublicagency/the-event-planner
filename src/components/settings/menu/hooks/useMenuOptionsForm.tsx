
import { useCallback } from "react";
import { MenuOption } from "@/hooks/useMenuOptions";
import { useMenuFormState } from "./useMenuFormState";
import { useMenuActions } from "./useMenuActions";

export const useMenuOptionsForm = (
  optionsData: MenuOption[],
  category: string,
  onSave: (updatedOptions: MenuOption[]) => Promise<boolean>
) => {
  // Use menu form state
  const {
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
    resetAddState,
    resetEditState
  } = useMenuFormState(optionsData);

  // Use menu form actions
  const {
    processingId,
    validateOption,
    createOption,
    updateOption,
    deleteOption
  } = useMenuActions(
    options,
    setOptions,
    category,
    onSave,
    resetAddState,
    resetEditState,
    setIsSaving
  );

  // Handler for adding a new option
  const handleAddOption = useCallback(() => {
    setIsAdding(true);
    setNewOption({ value: "", label: "" });
  }, [setIsAdding, setNewOption]);

  // Handler for canceling adding a new option
  const handleCancelAdd = useCallback(() => {
    resetAddState();
  }, [resetAddState]);

  // Handler for changing a field in the new option
  const handleNewOptionChange = useCallback((field: "value" | "label", value: string) => {
    setNewOption(prev => ({ ...prev, [field]: value }));
  }, [setNewOption]);

  // Handler for saving a new option
  const handleSaveNew = useCallback(async () => {
    if (!validateOption(newOption.value, newOption.label, true)) {
      return;
    }

    const success = await createOption(newOption.value, newOption.label);
    if (success) {
      resetAddState();
    }
  }, [newOption, validateOption, createOption, resetAddState]);

  // Handler for selecting an option to edit
  const handleEdit = useCallback((option: MenuOption) => {
    setEditingId(option.id);
    setEditedOption({
      value: option.value,
      label: option.label
    });
  }, [setEditingId, setEditedOption]);

  // Handler for canceling editing an option
  const handleCancelEdit = useCallback(() => {
    resetEditState();
  }, [resetEditState]);

  // Handler for changing a field in the edited option
  const handleEditChange = useCallback((field: "value" | "label", value: string) => {
    setEditedOption(prev => ({ ...prev, [field]: value }));
  }, [setEditedOption]);

  // Handler for saving an edited option
  const handleSaveEdit = useCallback(async (id: string) => {
    if (!validateOption(editedOption.value, editedOption.label, false, id)) {
      return;
    }

    const success = await updateOption(id, editedOption.value, editedOption.label);
    if (success) {
      resetEditState();
    }
  }, [editedOption, validateOption, updateOption, resetEditState]);

  // Handler for deleting an option
  const handleDeleteOption = useCallback(async (id: string) => {
    await deleteOption(id);
  }, [deleteOption]);

  return {
    // State
    options,
    isAdding,
    isSaving,
    editingId,
    newOption,
    editedOption,
    processingId,
    // Adding functions
    handleAddOption,
    handleCancelAdd,
    handleNewOptionChange,
    handleSaveNew,
    // Editing functions
    handleEdit,
    handleCancelEdit,
    handleEditChange,
    handleSaveEdit,
    // Deleting function
    handleDeleteOption
  };
};
