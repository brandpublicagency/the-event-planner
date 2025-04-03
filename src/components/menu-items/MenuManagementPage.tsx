
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import MenuSectionsTable from './MenuSectionsTable';

const MenuManagementPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Menu Sections</h2>
          <p className="text-muted-foreground">
            Create and manage menu sections, choices, and items in a hierarchical structure.
          </p>
        </div>
        
        <MenuSectionsTable />
      </div>
    </div>
  );
};

export default MenuManagementPage;
