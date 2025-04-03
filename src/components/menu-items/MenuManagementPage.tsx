
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

const MenuManagementPage = () => {
  const { sections, isLoading: sectionsLoading } = useMenuSections();
  const { menuItems, isLoading: itemsLoading } = useMenuItems();

  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Menu Structure</h2>
          <p className="text-muted-foreground">
            Create and manage menu sections, choices, and items in a hierarchical structure.
          </p>
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
      </div>
    </div>
  );
};

export default MenuManagementPage;
