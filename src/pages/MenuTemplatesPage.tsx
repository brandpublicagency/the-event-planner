
import React from 'react';
import { Header } from "@/components/layout/Header";
import MenuTemplateImporter from '@/components/menu-templates/MenuTemplateImporter';
import MenuSectionsTable from '@/components/menu-items/MenuSectionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PackageOpen, Settings } from "lucide-react";

const MenuTemplatesPage = () => {
  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Menu Management" 
      />
      
      <div className="flex-1 p-6 py-5 px-6 bg-gray-50 overflow-auto">
        <Tabs defaultValue="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Menu Structure
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Guide
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="templates" className="space-y-4">
            <MenuTemplateImporter />
          </TabsContent>
          
          <TabsContent value="structure" className="space-y-4">
            <MenuSectionsTable />
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Management Guide</CardTitle>
                <CardDescription>
                  How to effectively manage your menu structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Understanding the Menu Structure</h3>
                  <p>Your menu is organized in a three-level hierarchy:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>
                      <span className="font-medium">Sections</span> - The main menu categories (e.g., "Starters", "Main Courses")
                    </li>
                    <li>
                      <span className="font-medium">Choices</span> - Options within sections (e.g., "Buffet Menu", "Plated Menu")
                    </li>
                    <li>
                      <span className="font-medium">Items</span> - Individual menu items within choices
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Using Templates</h3>
                  <p>The Templates tab allows you to import pre-defined menu structures:</p>
                  <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li>Select a template from the available options</li>
                    <li>Review the structure to ensure it matches your needs</li>
                    <li>Import the template to create all sections, choices and items at once</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the easiest way to set up your initial menu structure.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Managing Menu Structure</h3>
                  <p>The Structure tab gives you fine-grained control:</p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Create, edit, and delete menu sections</li>
                    <li>Manage choices within sections</li>
                    <li>Add and organize individual menu items</li>
                    <li>Use drag-and-drop to reorder items</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">Pro Tip: Categories</h3>
                  <p className="text-blue-700">
                    Some menu choices like Buffet Menu use categories to organize items (e.g., "MEAT SELECTION", "VEGETABLES").
                    These categories are automatically created when you import a template and help keep your menu items organized.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenuTemplatesPage;
