
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import MenuChoiceDialog from './MenuChoiceDialog';
import { MenuChoice } from '@/api/menuItemsApi';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MenuItemsList from './MenuItemsList';

interface MenuChoiceCardsProps {
  sectionId: string;
}

const MenuChoiceCards: React.FC<MenuChoiceCardsProps> = ({ sectionId }) => {
  const {
    choices,
    isLoading,
    handleAddChoice,
    handleUpdateChoice,
    handleDeleteChoice,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuChoices(sectionId);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingChoice, setEditingChoice] = useState<MenuChoice | null>(null);
  const [choiceToDelete, setChoiceToDelete] = useState<MenuChoice | null>(null);
  const [expandedChoice, setExpandedChoice] = useState<string | null>(null);

  const toggleExpand = (choiceId: string) => {
    setExpandedChoice(expandedChoice === choiceId ? null : choiceId);
  };

  if (isLoading) {
    return <div className="text-center py-4 text-sm text-gray-500">Loading choices...</div>;
  }

  if (choices.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4 text-sm text-gray-500">
          No choices added yet
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAddDialog(true)} 
          className="w-full"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add First Choice
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {choices.map((choice) => (
          <Card key={choice.id} className="border border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-medium">{choice.label}</CardTitle>
                  <CardDescription className="text-xs">
                    Value: {choice.value}
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setEditingChoice(choice)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setChoiceToDelete(choice)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <Collapsible open={expandedChoice === choice.id} onOpenChange={() => toggleExpand(choice.id)}>
              <CardContent className="pb-0 pt-0">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between py-1" size="sm">
                    <span className="text-xs">Menu Items</span>
                    {expandedChoice === choice.id ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </CardContent>
              
              <CollapsibleContent>
                <CardContent className="pt-2">
                  <MenuItemsList choiceId={choice.id} choiceLabel={choice.label} />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
            
            <CardFooter className="py-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs w-full"
                onClick={() => toggleExpand(choice.id)}
              >
                {expandedChoice === choice.id ? 'Hide Items' : 'Show Items'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => setShowAddDialog(true)} 
        className="w-full"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Choice
      </Button>

      {/* Add Dialog */}
      <MenuChoiceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={(data) => {
          handleAddChoice({
            ...data,
            section_id: sectionId
          });
          setShowAddDialog(false);
        }}
        isSubmitting={isCreating}
        title="Add Choice"
        sectionId={sectionId}
      />

      {/* Edit Dialog */}
      <MenuChoiceDialog
        open={!!editingChoice}
        onOpenChange={(open) => !open && setEditingChoice(null)}
        onSubmit={(data) => editingChoice && handleUpdateChoice(editingChoice.id, data)}
        isSubmitting={isUpdating}
        initialData={editingChoice || undefined}
        title="Edit Choice"
        sectionId={sectionId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!choiceToDelete} 
        onOpenChange={(open) => !open && setChoiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the choice "{choiceToDelete?.label}" and all its items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (choiceToDelete) {
                  handleDeleteChoice(choiceToDelete.id);
                  setChoiceToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuChoiceCards;
