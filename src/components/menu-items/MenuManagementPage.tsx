
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from '@/components/PageHeader';
import MenuSectionsTable from './MenuSectionsTable';
import MenuChoicesTable from './MenuChoicesTable';

const MenuManagementPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sections Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Menu Sections</h3>
            <MenuSectionsTable />
          </div>

          {/* Choices Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Menu Choices</h3>
            <MenuChoicesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagementPage;
