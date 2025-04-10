
import React, { useState } from 'react';
import { useMenuChoices } from '@/hooks/useMenuChoices';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from 'lucide-react';
import MenuItemsTable from './MenuItemsTable';
import MenuChoiceDialog from './MenuChoiceDialog';
import MenuChoiceInlineForm from './MenuChoiceInlineForm';

interface MenuChoicesTableProps {
  sectionId: string;
}

// Define standard categories used across menu types
const STANDARD_CATEGORIES = [
  "MEAT SELECTION",
  "VEGETABLES",
  "STARCH SELECTION",
  "SALAD",
  "DESSERT",
  "STARTER"
];

const MenuChoicesTable: React.FC<MenuChoicesTableProps> = ({ sectionId }) => {
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

  const [expandedChoices, setExpandedChoices] = useState<Record<string, boolean>>({});
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [isAddingChoice, setIsAddingChoice] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleChoice = (choiceId: string) => {
    setExpandedChoices(prev => ({
      ...prev,
      [choiceId]: !prev[choiceId]
    }));
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading menu choices...</div>;
  }

  return (
    <div className="space-y-4">
      {choices.length > 0 ? (
        <div className="divide-y border rounded-md">
          {choices.map(choice => (
            <div key={choice.id} className="bg-white">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6"
                    onClick={() => toggleChoice(choice.id)}
                  >
                    {expandedChoices[choice.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <h3 className="text-sm font-medium">
                      {choice.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {choice.value}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingChoiceId(choice.id)}
                    disabled={isDeleting || editingChoiceId !== null}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteChoice(choice.id)}
                    disabled={isDeleting || editingChoiceId !== null}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {editingChoiceId === choice.id && (
                <div className="p-3 border-t bg-muted/20">
                  <MenuChoiceInlineForm
                    initialData={choice}
                    onSubmit={(data) => {
                      handleUpdateChoice(choice.id, data);
                      setEditingChoiceId(null);
                    }}
                    onCancel={() => setEditingChoiceId(null)}
                    isSubmitting={isUpdating}
                    sectionId={sectionId}
                  />
                </div>
              )}
              
              {expandedChoices[choice.id] && (
                <div className="p-3 border-t bg-gray-50">
                  <MenuItemsTable 
                    choiceId={choice.id} 
                    availableCategories={STANDARD_CATEGORIES}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No menu choices found. Add the first one below.
        </div>
      )}
      
      {isAddingChoice ? (
        <div className="border rounded-md p-4 bg-muted/20">
          <h3 className="text-sm font-medium mb-2">Add New Choice</h3>
          <MenuChoiceInlineForm
            onSubmit={(data) => {
              handleAddChoice(data);
              setIsAddingChoice(false);
            }}
            onCancel={() => setIsAddingChoice(false)}
            isSubmitting={isCreating}
            sectionId={sectionId}
          />
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsAddingChoice(true)}
            disabled={editingChoiceId !== null}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Choice Inline
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={editingChoiceId !== null}
            variant="default"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Choice
          </Button>
        </div>
      )}
      
      <MenuChoiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddChoice}
        isSubmitting={isCreating}
        title="Add Menu Choice"
        sectionId={sectionId}
      />
    </div>
  );
};

export default MenuChoicesTable;
