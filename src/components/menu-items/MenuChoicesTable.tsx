
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, Trash2, FolderPlus } from 'lucide-react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import MenuChoiceDialog from './MenuChoiceDialog';
import MenuItemsManager from './MenuItemsManager';
import MenuChoiceInlineForm from './MenuChoiceInlineForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MenuChoice } from '@/api/menuItemsApi';
import CategoryManagerDialog from './CategoryManagerDialog';

interface MenuChoicesTableProps {
  sectionId: string;
  isMainCourseSection?: boolean;
}

const MenuChoicesTable: React.FC<MenuChoicesTableProps> = ({
  sectionId,
  isMainCourseSection = false
}) => {
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
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<MenuChoice | null>(null);

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

  const handleAddCategory = (choice: MenuChoice) => {
    console.log("Add category clicked for choice:", choice);
    setSelectedChoice(choice);
    setIsCategoryDialogOpen(true);
  };

  return <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium text-base">Choices</h4>
        <Button size="sm" onClick={() => setShowInlineForm(true)} className="font-normal text-xs">
          <PlusIcon className="h-3 w-3 mr-1.5" />
          Add Choice
        </Button>
      </div>
      
      {isLoading ? <div className="text-center py-4">Loading choices...</div> : <div className="space-y-5">
          {choices.length === 0 ? <div className="text-center py-4 text-gray-500">
              No choices added yet
            </div> : choices.map(choice => <div key={choice.id} className="mb-5">
                <div className="flex justify-between items-center mb-2 border border-gray-500 rounded-md p-3 bg-white">
                  <div className="flex items-center">
                    <h5 className="font-medium text-sm text-zinc-950">{choice.label}</h5>
                    <p className="text-[10px] text-gray-500 ml-2">Value: {choice.value}, Order: {choice.display_order}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(choice)} className="h-6 w-6 text-zinc-400">
                      <Pencil className="h-3 w-3" />
                    </Button>
                    {isMainCourseSection && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleAddCategory(choice)} 
                        className="h-6 w-6 text-zinc-400" 
                        title="Add Category"
                      >
                        <FolderPlus className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(choice)} className="h-6 w-6 text-zinc-400">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <MenuItemsManager choiceId={choice.id} choiceLabel={choice.label} hideChoiceLabel={true} />
                </div>
              </div>)}
          
          {showInlineForm && <MenuChoiceInlineForm onSubmit={data => {
        handleAddChoice(data);
        setShowInlineForm(false);
      }} onCancel={() => setShowInlineForm(false)} isSubmitting={isCreating} sectionId={sectionId} />}
        </div>}

      {editingChoice && <MenuChoiceDialog open={!!editingChoice} onOpenChange={open => !open && setEditingChoice(null)} onSubmit={data => handleUpdateChoice(editingChoice.id, data)} isSubmitting={isUpdating} initialData={editingChoice} title="Edit Choice" sectionId={sectionId} />}

      <AlertDialog open={!!choiceToDelete} onOpenChange={open => !open && setChoiceToDelete(null)}>
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

      {/* Category Manager Dialog */}
      {selectedChoice && (
        <CategoryManagerDialog 
          open={isCategoryDialogOpen} 
          onOpenChange={setIsCategoryDialogOpen} 
          choiceId={selectedChoice.id}
          choiceLabel={selectedChoice.label}
        />
      )}
    </div>;
};

export default MenuChoicesTable;
