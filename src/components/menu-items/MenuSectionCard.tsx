
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MenuSection } from '@/api/menuItemsApi';
import { useMenuSections } from '@/hooks/useMenuSections';
import MenuSectionDialog from './MenuSectionDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MenuChoiceCards from './MenuChoiceCards';

interface MenuSectionCardProps {
  section: MenuSection;
}

const MenuSectionCard: React.FC<MenuSectionCardProps> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { 
    handleUpdateSection, 
    handleDeleteSection,
    isUpdating,
    isDeleting 
  } = useMenuSections();

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{section.label}</CardTitle>
              <CardDescription className="text-xs mt-1">
                Value: {section.value}
              </CardDescription>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardContent className="pt-0 pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between" size="sm">
                <span>Menu Choices</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardContent>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <MenuChoiceCards sectionId={section.id} />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
        
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide Details' : 'Show Details'}
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Section Dialog */}
      <MenuSectionDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={data => handleUpdateSection(section.id, data)}
        isSubmitting={isUpdating}
        initialData={section}
        title="Edit Section"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu section "{section.label}" and all its choices and items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleDeleteSection(section.id);
                setConfirmDelete(false);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MenuSectionCard;
