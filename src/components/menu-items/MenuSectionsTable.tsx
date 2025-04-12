
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil, Trash2 } from 'lucide-react';
import { useMenuSections } from '@/hooks/useMenuSections';
import MenuSectionDialog from './MenuSectionDialog';
import MenuChoicesTable from './MenuChoicesTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MenuSection } from '@/api/menuItemsApi';
import { Separator } from "@/components/ui/separator";

const MenuSectionsTable = () => {
  const {
    sections,
    isLoading,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    editingSection,
    setEditingSection,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating,
    isUpdating,
    isDeleting
  } = useMenuSections();
  
  const [sectionToDelete, setSectionToDelete] = useState<MenuSection | null>(null);
  
  const handleEditClick = (section: MenuSection) => {
    setEditingSection(section);
  };
  
  const handleDeleteClick = (section: MenuSection) => {
    setSectionToDelete(section);
  };
  
  const confirmDelete = () => {
    if (sectionToDelete) {
      handleDeleteSection(sectionToDelete.id);
      setSectionToDelete(null);
    }
  };

  // Find the main course section ID for passing to the MenuChoicesTable
  const mainsSectionId = sections.find(section => section.value === 'sec-mains')?.id;
  
  return <div className="space-y-6">
      <Button size="sm" onClick={() => setIsAddDialogOpen(true)} className="mb-4">
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Section
      </Button>

      {isLoading ? <div className="text-center py-4">Loading sections...</div> : <div className="space-y-8">
          {sections.length === 0 ? <div className="text-center py-4 text-gray-500 p-6">
              No sections added yet
            </div> : sections.map(section => <div key={section.id} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{section.label}</h3>
                    <p className="text-[10px] text-gray-500">Value: {section.value}, Order: {section.display_order}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(section)} className="text-zinc-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(section)} className="text-zinc-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="mb-4" />

                <div>
                  {/* Always pass the actual section ID, but also pass the section value as a separate prop */}
                  <MenuChoicesTable 
                    sectionId={section.id} 
                    isMainCourseSection={section.value === 'sec-mains'} 
                  />
                </div>
              </div>)}
        </div>}

      {/* Add Dialog */}
      <MenuSectionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSubmit={handleAddSection} isSubmitting={isCreating} title="Add Section" />

      {/* Edit Dialog */}
      {editingSection && <MenuSectionDialog open={!!editingSection} onOpenChange={open => !open && setEditingSection(null)} onSubmit={data => handleUpdateSection(editingSection.id, data)} isSubmitting={isUpdating} initialData={editingSection} title="Edit Section" />}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!sectionToDelete} onOpenChange={open => !open && setSectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the menu section
              {sectionToDelete && ` "${sectionToDelete.label}"`} and all associated choices and items.
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
    </div>;
};

export default MenuSectionsTable;
