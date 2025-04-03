
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import MenuSectionsTable from './MenuSectionsTable';
import { useMenuSections } from '@/hooks/useMenuSections';
import { useMenuItems } from '@/hooks/useMenuItems';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MenuChoicesTable from './MenuChoicesTable';
import MenuItemDialog from './MenuItemDialog';
import { PlusIcon } from 'lucide-react';

const MenuManagementPage = () => {
  const { sections, isLoading: sectionsLoading } = useMenuSections();
  const { 
    menuItems, 
    isLoading: itemsLoading,
    handleAddItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isCreating
  } = useMenuItems();

  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Menu Structure</h2>
            <p className="text-muted-foreground">
              Create and manage menu sections, choices, and items in a hierarchical structure.
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="ml-4"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
        
        {sectionsLoading ? (
          <div className="text-center py-8">Loading menu structure...</div>
        ) : (
          <>
            <Accordion type="multiple" className="w-full mb-8">
              {sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {section.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-4 pt-2">
                      <MenuChoicesTable sectionId={section.id} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8">
              <MenuSectionsTable />
            </div>
          </>
        )}

        {/* Global Add Item Dialog */}
        <MenuItemDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddItem}
          isSubmitting={isCreating}
          title="Add Menu Item"
          choiceId=""
        />
      </div>
    </div>
  );
};

export default MenuManagementPage;
