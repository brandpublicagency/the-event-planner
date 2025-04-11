
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import MenuTemplateImporter from '@/components/menu-templates/MenuTemplateImporter';
import MenuSectionsTable from '@/components/menu-items/MenuSectionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PackageOpen, Info, ListTree, Check, Search, Settings, Plus } from "lucide-react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMenuSections } from '@/hooks/useMenuSections';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuSectionsManager } from '@/components/menu-items/MenuSectionsManager';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MenuManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'structure';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const navigate = useNavigate();
  const { sections, refetch, isLoading } = useMenuSections();
  
  useEffect(() => {
    // Update URL when tab changes
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.scrollTo(0, 0);
  };
  
  const handleImportSuccess = () => {
    toast.success("Template imported successfully!");
    setShowSuccessAlert(true);
    
    // Refresh sections to show newly imported data
    refetch();
    
    // Switch to structure tab after successful import
    setTimeout(() => {
      setActiveTab('structure');
    }, 1000);
    
    // Auto-hide success alert after 5 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Menu Management" 
      />
      
      <div className="flex-1 p-6 py-5 px-6 bg-gray-50 overflow-auto">
        <AnimatePresence>
          {showSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your template was successfully imported. The menu structure is now available.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your menu structure, choices, and items
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {activeTab === 'structure' && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search menus..."
                    className="pl-9 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="structure" className="flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <PackageOpen className="h-4 w-4" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="guide" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Guide
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="structure" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Menu Structure</h2>
                <p className="text-muted-foreground">
                  Manage your menu sections, choices, and items
                </p>
              </div>
              <div className="flex gap-3">
                {sections.length === 0 && (
                  <Button 
                    onClick={() => setActiveTab('templates')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PackageOpen className="h-4 w-4" />
                    Import Template
                  </Button>
                )}
                {sections.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuItem onClick={() => setViewMode('table')}>
                        Table View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewMode('grid')}>
                        Expanded View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {sections.length > 0 && (
                  <Button 
                    onClick={() => setActiveTab('templates')}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <PackageOpen className="h-4 w-4" />
                    Import More
                  </Button>
                )}
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  <p className="text-sm text-gray-500">Loading menu structure...</p>
                </div>
              </div>
            ) : (
              viewMode === 'table' ? (
                <Card className="bg-white shadow-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Menu Sections</CardTitle>
                    <CardDescription>
                      Manage your menu sections and their choices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MenuSectionsManager />
                  </CardContent>
                </Card>
              ) : (
                <div className={cn(
                  "transition-all duration-300 ease-in-out",
                  viewMode === 'grid' ? 'opacity-100' : 'opacity-0'
                )}>
                  <MenuSectionsTable />
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Menu Templates</h2>
              <p className="text-muted-foreground">
                Import predefined menu templates to quickly set up your menu structure
              </p>
            </div>
            <Card className="bg-white shadow-sm border-gray-200">
              <CardContent className="pt-6">
                <MenuTemplateImporter onImportSuccess={handleImportSuccess} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle>Menu Management Guide</CardTitle>
                <CardDescription>
                  How to effectively manage your menu structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Understanding the Menu Structure</h3>
                  <p>Your menu is organized in a three-level hierarchy:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-blue-50 border-blue-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>The main menu categories (e.g., "Starters", "Main Courses")</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Choices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Options within sections (e.g., "Buffet Menu", "Plated Menu")</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Individual menu items within choices</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <h3 className="font-medium text-lg">Using Templates</h3>
                  <p>The Templates tab allows you to import pre-defined menu structures:</p>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                      <li className="text-gray-700">Select a template from the available options</li>
                      <li className="text-gray-700">Review the structure to ensure it matches your needs</li>
                      <li className="text-gray-700">Import the template to create all sections, choices and items at once</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-3">
                      This is the easiest way to set up your initial menu structure.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  <h3 className="font-medium text-lg">Managing Menu Structure</h3>
                  <p>The Structure tab gives you fine-grained control:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-2">Sections & Choices</h4>
                      <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
                        <li>Create, edit, and delete menu sections</li>
                        <li>Manage choices within sections</li>
                        <li>Organize menu structure hierarchically</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium mb-2">Items & Categories</h4>
                      <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
                        <li>Add and organize individual menu items</li>
                        <li>Use drag-and-drop to reorder items</li>
                        <li>Group items using categories</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-md border border-blue-100 mt-4">
                  <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Pro Tip: Categories
                  </h3>
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
