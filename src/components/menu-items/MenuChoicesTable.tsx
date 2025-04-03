import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import MenuChoiceDialog from './MenuChoiceDialog';
import MenuItemsManager from './MenuItemsManager';
import MenuChoiceInlineForm from './MenuChoiceInlineForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MenuChoice } from '@/api/menuItemsApi';

interface MenuChoicesTableProps {
  sectionId: string;
}

const MenuChoicesTable: React.FC<MenuChoicesTableProps> = ({ sectionId }) => {
  const { 
    choices, 
    isLoading,
    handleAddChoice,
    handleUpdateChoice,
    handleDeleteChoice,
    editingChoice,
    setEditingChoice,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuChoices(sectionId);

  const [choiceToDelete, setChoiceToDelete] = useState<MenuChoice | null>(null);
  const [showInlineForm, setShowInlineForm] = useState(false);

  const handleEditClick = (choice: MenuChoice) => {
    setEditingChoice(choice);
  };

  const handleDeleteClick = (choice: MenuChoice) => {
    setChoiceToDelete(choice);
  };

  const confirmDelete = () => {
    if (choiceToDelete) {
      handleDeleteChoice(choiceToDelete.id);
      setChoiceToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        size="sm" 
        onClick={() => setShowInlineForm(true)}
        className="mb-4"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Choice
      </Button>

      {showInlineForm && (
        <MenuChoiceInlineForm 
          onSubmit={(data) => {
            handleAddChoice(data);
            setShowInlineForm(false);
          }}
          onCancel={() => setShowInlineForm(false)}
          isSubmitting={isCreating}
          sectionId={sectionId}
        />
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading choices...</div>
      ) : (
        <div className="space-y-6">
          {choices.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No choices added yet
            </div>
          ) : (
            choices.map((choice) => (
              <div key={choice.id} className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h5 className="font-medium">{choice.label}</h5>
                    <p className="text-xs text-gray-500">Value: {choice.value}, Order: {choice.display_order}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(choice)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(choice)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <MenuItemsManager 
                    choiceId={choice.id}
                    choiceLabel={choice.label}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Dialog - we still keep this for editing choices */}
      {editingChoice && (
        <MenuChoiceDialog
          open={!!editingChoice}
          onOpenChange={(open) => !open && setEditingChoice(null)}
          onSubmit={(data) => handleUpdateChoice(editingChoice.id, data)}
          isSubmitting={isUpdating}
          initialData={editingChoice}
          title="Edit Choice"
          sectionId={sectionId}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!choiceToDelete} onOpenChange={(open) => !open && setChoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu choice
              {choiceToDelete && ` "${choiceToDelete.label}"`} and all associated items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuChoicesTable;
