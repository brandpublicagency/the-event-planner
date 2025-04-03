
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import MenuChoiceDialog from './MenuChoiceDialog';
import MenuItemsManager from './MenuItemsManager';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const [expandedChoices, setExpandedChoices] = useState<string[]>([]);

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

  const toggleChoice = (choiceId: string) => {
    setExpandedChoices(prev => 
      prev.includes(choiceId)
        ? prev.filter(id => id !== choiceId)
        : [...prev, choiceId]
    );
  };

  return (
    <div className="space-y-4">
      <Button 
        size="sm" 
        onClick={() => setIsAddDialogOpen(true)}
        className="mb-4"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Choice
      </Button>

      {isLoading ? (
        <div className="text-center py-4">Loading choices...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {choices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No choices added yet
                  </TableCell>
                </TableRow>
              ) : (
                choices.map((choice) => (
                  <React.Fragment key={choice.id}>
                    <TableRow>
                      <TableCell>{choice.label}</TableCell>
                      <TableCell>{choice.value}</TableCell>
                      <TableCell>{choice.display_order}</TableCell>
                      <TableCell>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleChoice(choice.id)}
                          >
                            {expandedChoices.includes(choice.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedChoices.includes(choice.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0 border-0">
                          <MenuItemsManager 
                            choiceId={choice.id}
                            choiceLabel={choice.label}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Dialog */}
      <MenuChoiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddChoice}
        isSubmitting={isCreating}
        title="Add Choice"
        sectionId={sectionId}
      />

      {/* Edit Dialog */}
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
