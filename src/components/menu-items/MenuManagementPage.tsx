
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import MenuSectionsTable from './MenuSectionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MenuManagementPage = () => {
  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      <div className="container mx-auto py-6 max-w-7xl">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu Structure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="tracking-tight text-xl font-medium">Menu Structure</h2>
                <p className="text-muted-foreground text-sm">
                  Manage your hierarchical menu structure with sections, choices, and items
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
              <MenuSectionsTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenuManagementPage;
