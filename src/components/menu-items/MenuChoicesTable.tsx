
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import MenuItemsManager from './MenuItemsManager';
import MenuChoiceInlineForm from './MenuChoiceInlineForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MenuChoice } from '@/api/menuItemsApi';
import { Dialog } from '@/components/ui/dialog';
import MenuChoiceDialog from './MenuChoiceDialog';
import { motion } from 'framer-motion';

interface MenuChoicesTableProps {
  sectionId: string;
}

const MenuChoicesTable: React.FC<MenuChoicesTableProps> = ({
  sectionId
}) => {
  const {
    choices,
    isLoading,
    handleAddChoice,
    handleUpdateChoice,
    handleDeleteChoice,
    editingChoice,
    setEditingChoice,
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
      {isLoading ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mb-2"></div>
          <p className="text-sm text-gray-500">Loading choices...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {choices.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No choices added yet
            </div>
          ) : (
            choices.map(choice => (
              <motion.div 
                key={choice.id} 
                className="mb-5"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-2 border border-gray-200 rounded-md p-3 bg-white hover:shadow-sm transition-shadow">
                  <div className="flex items-center">
                    <h5 className="font-medium text-sm text-zinc-950">{choice.label}</h5>
                    <p className="text-[10px] text-gray-500 ml-2">Value: {choice.value}, Order: {choice.display_order}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditClick(choice)} 
                      className="h-6 w-6 hover:bg-gray-100"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(choice)} 
                      className="h-6 w-6 hover:bg-red-50 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <MenuItemsManager choiceId={choice.id} choiceLabel={choice.label} hideChoiceLabel={true} />
                </div>
              </motion.div>
            ))
          )}
          
          {/* Add Choice button */}
          <Button 
            size="sm" 
            onClick={() => setShowInlineForm(true)} 
            className="w-full mt-4 border border-dashed border-gray-300 bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800"
          >
            <PlusIcon className="h-3 w-3 mr-1.5" />
            Add Choice
          </Button>
        </div>
      )}

      {/* Inline form for adding choices */}
      {showInlineForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <MenuChoiceInlineForm 
            onSubmit={data => {
              handleAddChoice(data);
              setShowInlineForm(false);
            }} 
            onCancel={() => setShowInlineForm(false)} 
            isSubmitting={isCreating} 
            sectionId={sectionId} 
          />
        </motion.div>
      )}

      {/* Edit Dialog - Properly wrapped in Dialog component */}
      {editingChoice && (
        <Dialog 
          open={!!editingChoice} 
          onOpenChange={open => !open && setEditingChoice(null)}
        >
          <MenuChoiceDialog 
            open={!!editingChoice} 
            onOpenChange={open => !open && setEditingChoice(null)} 
            onSubmit={data => handleUpdateChoice(editingChoice.id, data)} 
            isSubmitting={isUpdating} 
            initialData={editingChoice} 
            title="Edit Choice" 
            sectionId={sectionId} 
          />
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!choiceToDelete} 
        onOpenChange={open => !open && setChoiceToDelete(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu choice
              {choiceToDelete && ` "${choiceToDelete.label}"`} and all associated items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuChoicesTable;
