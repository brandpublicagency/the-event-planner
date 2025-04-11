
import React, { useState } from 'react';
import { Header } from "@/components/layout/Header";
import MenuTemplateImporter from '@/components/menu-templates/MenuTemplateImporter';
import MenuSectionsTable from '@/components/menu-items/MenuSectionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PackageOpen, Settings, PlusCircle } from "lucide-react";
import { useSearchParams } from 'react-router-dom';

const MenuManagement = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'structure';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Menu Management" 
      />
      
      <div className="flex-1 p-6 py-5 px-6 bg-gray-50 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <TabsList>
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Menu Structure
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4" />
                Import Templates
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Guide
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="structure" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Menu Structure</h1>
                <p className="text-muted-foreground">
                  Manage your menu sections, choices, and items
                </p>
              </div>
              <div className="flex gap-2">
                <Tabs defaultValue="sections" className="w-full">
                  <TabsList className="h-8">
                    <TabsTrigger value="sections" className="text-xs px-3 py-1">Sections</TabsTrigger>
                    <TabsTrigger value="items" className="text-xs px-3 py-1">Items</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <MenuSectionsTable />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight">Menu Templates</h1>
              <p className="text-muted-foreground">
                Import predefined menu templates to quickly set up your menu structure
              </p>
            </div>
            <MenuTemplateImporter />
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

export default MenuManagement;
