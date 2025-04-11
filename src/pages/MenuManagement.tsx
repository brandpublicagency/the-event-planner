
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import MenuTemplateImporter from '@/components/menu-templates/MenuTemplateImporter';
import MenuSectionsTable from '@/components/menu-items/MenuSectionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PackageOpen, Info, ListTree, Check, Search, Settings, Plus, ChefHat, Library, ArrowRight } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const MenuManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'structure';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
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
  
  const handleImportStart = () => {
    setIsImporting(true);
    setImportProgress(0);
    
    // Simulate import progress
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleImportSuccess = () => {
    setIsImporting(false);
    setImportProgress(100);
    
    toast.success("Template imported successfully!", {
      description: "Your menu structure is now ready to use."
    });
    
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
  
  // Templates with visual previews
  const templateExamples = [
    {
      id: 'buffet-menu',
      title: 'Buffet Menu',
      description: 'Selection of meats, vegetables, starches and salads',
      sections: ['Meat Selection', 'Vegetables', 'Starch Selection', 'Salad'],
      image: '/images/buffet.jpg',
      color: 'bg-amber-50 border-amber-100',
      icon: <ChefHat className="h-6 w-6 text-amber-600" />
    },
    {
      id: 'plated-menu',
      title: 'Plated Menu',
      description: 'Elegant plated options with main course and salad',
      sections: ['Main Selection', 'Salad'],
      image: '/images/plated.jpg',
      color: 'bg-emerald-50 border-emerald-100',
      icon: <Library className="h-6 w-6 text-emerald-600" />
    },
    {
      id: 'dessert-menu',
      title: 'Dessert Menu',
      description: 'Sweet endings with canapés and individual cakes',
      sections: ['Dessert Canapés', 'Individual Cakes'],
      image: '/images/dessert.jpg',
      color: 'bg-purple-50 border-purple-100',
      icon: <Utensils className="h-6 w-6 text-purple-600" />
    },
    {
      id: 'custom',
      title: 'Custom Template',
      description: 'Create your own menu structure from scratch',
      sections: [],
      color: 'bg-blue-50 border-blue-100',
      icon: <Plus className="h-6 w-6 text-blue-600" />
    }
  ];

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
            ) : sections.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center p-10 border border-dashed rounded-lg border-gray-300 bg-gray-50"
              >
                <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                  <div className="p-3 rounded-full bg-blue-50">
                    <PackageOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium">No menu structure yet</h3>
                  <p className="text-gray-500 mb-2">
                    Start by importing a template or creating a new menu structure from scratch.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm mt-2">
                    <Button 
                      onClick={() => setActiveTab('templates')}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <PackageOpen className="h-4 w-4" />
                      Use Template
                    </Button>
                    <Button 
                      onClick={() => {
                        setViewMode('table');
                        const newSectionDialog = document.getElementById('add-section-button');
                        if (newSectionDialog) {
                          setTimeout(() => {
                            newSectionDialog.click();
                          }, 100);
                        }
                      }}
                      variant="outline"
                      className="flex items-center justify-center gap-2 bg-white"
                    >
                      <Plus className="h-4 w-4" />
                      Create Manually
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {viewMode === 'table' ? (
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
                )}
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Menu Templates</h2>
              <p className="text-muted-foreground">
                Import predefined menu templates to quickly set up your menu structure
              </p>
            </div>
            
            {isImporting ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-lg mx-auto bg-white p-8 rounded-lg border shadow-sm"
              >
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Importing Template</h3>
                  <p className="text-gray-500 mb-6">Please wait while we prepare your menu structure</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Import progress</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
                
                <div className="mt-8 text-sm text-gray-500 italic text-center">
                  This will only take a few moments...
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {templateExamples.map((template, i) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group",
                      template.color
                    )}
                    onClick={() => {
                      handleImportStart();
                      setTimeout(() => {
                        handleImportSuccess();
                      }, 2500);
                    }}
                  >
                    <div className="h-36 bg-white relative overflow-hidden">
                      {template.id !== 'custom' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          {template.icon}
                        </div>
                      )}
                      
                      {template.id === 'custom' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                          {template.icon}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4 flex flex-col items-start justify-end h-1/2">
                        <h3 className="text-white font-semibold text-lg drop-shadow-sm mb-1">
                          {template.title}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white">
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      
                      {template.sections.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 mb-2">Includes sections:</p>
                          <div className="space-y-1.5">
                            {template.sections.map((section, idx) => (
                              <div key={idx} className="flex items-center text-xs text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                {section}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-20 flex items-center justify-center">
                          <p className="text-xs text-gray-500 italic">Create your own structure</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 bg-white border-t border-gray-100 group-hover:bg-gray-50 transition-colors">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-center text-sm"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-70" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            <Card className="bg-white shadow-sm border-gray-200 mt-8">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Import Options</CardTitle>
                <CardDescription>
                  Use our import tool for more detailed menu template configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
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
