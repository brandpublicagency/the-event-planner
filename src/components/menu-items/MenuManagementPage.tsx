
import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useMenuSections } from '@/hooks/useMenuSections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuSection } from '@/api/menuItemsApi';
import MenuSectionCard from './MenuSectionCard';
import MenuItemDialog from './MenuItemDialog';
import { useMenuItems } from '@/hooks/useMenuItems';
import CategoryManager from './CategoryManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const MenuManagementPage = () => {
  const {
    sections,
    isLoading: sectionsLoading,
    handleAddSection,
    setIsAddDialogOpen: setIsSectionDialogOpen,
  } = useMenuSections();

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddItem,
    isCreating
  } = useMenuItems();

  return (
    <div className="flex flex-col h-full">
      <PageHeader pageTitle="Menu Management" />
      
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="menu">Menu Structure</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Menu Structure</h2>
                <p className="text-muted-foreground mb-6">
                  Create and organize your menu items in a logical structure for your customers to browse.
                </p>
                
                <Separator className="my-6" />
              </div>
              
              {sectionsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">Loading menu sections...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {sections.length === 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>No Menu Sections</CardTitle>
                        <CardDescription>
                          Create your first menu section to start building your menu.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => setIsSectionDialogOpen(true)} 
                          className="w-full"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create First Section
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Your Menu Sections</h3>
                        <Button 
                          size="sm" 
                          onClick={() => setIsSectionDialogOpen(true)}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Section
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section: MenuSection) => (
                          <MenuSectionCard key={section.id} section={section} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Menu Categories</h2>
              <p className="text-muted-foreground mb-6">
                Create categories to organize your menu items into logical groups.
              </p>
              
              <Separator className="my-6" />
              
              <CategoryManager />
            </div>
          </TabsContent>
        </Tabs>

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
