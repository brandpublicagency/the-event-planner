
import React, { useState } from 'react';
import { useMenuSections } from '@/hooks/useMenuSections';
import { Button } from '@/components/ui/button';
import { MenuSection } from '@/api/menuItemsApi';
import MenuSectionDialog from './MenuSectionDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EditIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MenuSectionsManager: React.FC = () => {
  const { 
    sections, 
    isLoading, 
    handleAddSection, 
    handleUpdateSection, 
    handleDeleteSection,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuSections();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<MenuSection | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Menu Sections</h3>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading sections...</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No sections defined yet</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Display Order</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.label}</TableCell>
                  <TableCell>{section.value}</TableCell>
                  <TableCell>{section.display_order}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSection(section)}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSectionToDelete(section)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Section Dialog */}
      <MenuSectionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSection}
        isSubmitting={isCreating}
        title="Add Menu Section"
      />
      
      {/* Edit Section Dialog */}
      <MenuSectionDialog
        open={!!editingSection}
        onOpenChange={(open) => !open && setEditingSection(null)}
        onSubmit={(data) => editingSection && handleUpdateSection(editingSection.id, data)}
        isSubmitting={isUpdating}
        initialData={editingSection || undefined}
        title="Edit Menu Section"
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!sectionToDelete} 
        onOpenChange={(open) => !open && setSectionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{sectionToDelete?.label}" section.
              <br /><br />
              <strong className="text-destructive">Warning:</strong> Any menu items in this section will also be deleted!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (sectionToDelete) {
                  handleDeleteSection(sectionToDelete.id);
                  setSectionToDelete(null);
                }
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuSectionsManager;
