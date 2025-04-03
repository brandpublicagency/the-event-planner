
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import MenuSectionsTable from './MenuSectionsTable';
import { useMenuSections } from '@/hooks/useMenuSections';
import { useMenuItems } from '@/hooks/useMenuItems';
import MenuItemDialog from './MenuItemDialog';

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
        </div>
        
        {sectionsLoading ? (
          <div className="text-center py-8">Loading menu structure...</div>
        ) : (
          <div className="space-y-8">
            <MenuSectionsTable />
          </div>
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
