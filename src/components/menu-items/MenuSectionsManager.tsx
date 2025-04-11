
import React, { useState } from 'react';
import { useMenuSections } from '@/hooks/useMenuSections';
import { Button } from '@/components/ui/button';
import { MenuSection } from '@/api/menuItemsApi';
import MenuSectionDialog from './MenuSectionDialog';
import { EditIcon, Trash2Icon, PlusIcon, ChevronDown, ChevronRight } from 'lucide-react';
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
import MenuChoicesTable from './MenuChoicesTable';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export const MenuSectionsManager: React.FC = () => {
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Menu Structure</h3>
          <p className="text-sm text-gray-500">Manage sections, choices, and items</p>
        </div>
        <Button 
          id="add-section-button"
          size="sm" 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusIcon className="h-4 w-4" />
          Add Section
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="text-sm text-gray-500">Loading sections...</p>
          </div>
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-lg border-gray-300 bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-500">No sections defined yet</p>
            <Button 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              className="mt-2"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Section
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Collapsible
                open={expandedSections[section.id]}
                onOpenChange={() => toggleSection(section.id)}
                className="border rounded-md overflow-hidden bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CollapsibleTrigger className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-gray-100">
                      {expandedSections[section.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                    <div>
                      <div className="font-medium">{section.label}</div>
                      <div className="text-xs text-gray-500 flex gap-2">
                        <span>Value: {section.value}</span>
                        <span>•</span>
                        <span>Order: {section.display_order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSection(section);
                      }}
                      className="hover:bg-gray-100"
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSectionToDelete(section);
                      }}
                      className="hover:bg-red-50 text-red-500 hover:text-red-600"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CollapsibleContent>
                  <Separator />
                  <div className="p-4 bg-gray-50">
                    <MenuChoicesTable sectionId={section.id} />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ))}
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
              <p className="mt-2 text-red-600 font-medium">Warning: Any menu items in this section will also be deleted!</p>
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
