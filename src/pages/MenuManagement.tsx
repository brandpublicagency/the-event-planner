
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Package, ListTree, Info, Plus, ChefHat, 
  ArrowRight, Check, Menu as MenuIcon, Layers, RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSections } from '@/hooks/useMenuSections';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MenuSectionsManager } from '@/components/menu-items/MenuSectionsManager';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getPredefinedCategories } from '@/utils/menuStructureUtils';

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('structure');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const { 
    sections, 
    isLoading, 
    refetch, 
    handleAddSection 
  } = useMenuSections();

  // Template definitions
  const templates = [
    {
      id: 'buffet-menu',
      title: 'Buffet Menu',
      description: 'Classic buffet with variety of options',
      categories: getPredefinedCategories('buffet-menu'),
      color: 'bg-amber-50 border-amber-200',
      icon: <ChefHat className="h-10 w-10 text-amber-500" />
    },
    {
      id: 'plated-menu',
      title: 'Plated Menu',
      description: 'Elegant plated service for formal events',
      categories: getPredefinedCategories('plated-menu'),
      color: 'bg-emerald-50 border-emerald-200',
      icon: <Layers className="h-10 w-10 text-emerald-500" />
    },
    {
      id: 'dessert-canapes',
      title: 'Dessert Canapés',
      description: 'Sweet bite-sized treats for events',
      categories: getPredefinedCategories('dessert-canapes'),
      color: 'bg-purple-50 border-purple-200',
      icon: <MenuIcon className="h-10 w-10 text-purple-500" />
    },
    {
      id: 'custom',
      title: 'Custom Template',
      description: 'Create your own menu structure',
      categories: [],
      color: 'bg-blue-50 border-blue-200',
      icon: <Plus className="h-10 w-10 text-blue-500" />
    }
  ];

  // Import template function
  const importTemplate = async (templateId: string) => {
    setIsImporting(true);
    setImportProgress(0);
    setSelectedTemplate(templateId);
    
    // Simulate import process
    const duration = 1500; // milliseconds
    const interval = 50;
    const steps = duration / interval;
    let progress = 0;
    
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      toast.error("Template not found");
      setIsImporting(false);
      return;
    }
    
    const importInterval = setInterval(() => {
      progress += (100 / steps);
      setImportProgress(Math.min(Math.round(progress), 100));
      
      if (progress >= 100) {
        clearInterval(importInterval);
        
        // Create sections based on template categories
        if (template.categories.length > 0) {
          const sectionPromises = template.categories.map((category, index) => {
            return handleAddSection({
              label: category,
              value: category.toLowerCase().replace(/\s+/g, '-'),
              display_order: index
            });
          });
          
          Promise.all(sectionPromises)
            .then(() => {
              refetch();
              setShowSuccessAlert(true);
              setIsImporting(false);
              toast.success(`${template.title} template imported successfully`);
              
              // Switch to structure tab after successful import
              setTimeout(() => {
                setActiveTab('structure');
              }, 1000);
              
              // Hide success alert after 5 seconds
              setTimeout(() => {
                setShowSuccessAlert(false);
              }, 5000);
            })
            .catch(error => {
              console.error('Error importing template:', error);
              toast.error("Failed to import template");
              setIsImporting(false);
            });
        } else {
          // For custom template
          setIsImporting(false);
          setActiveTab('structure');
          toast.success("Ready to create custom menu structure");
        }
      }
    }, interval);
  };

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Menu Management" />
      
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        <AnimatePresence>
          {showSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Template imported successfully. Your menu structure is ready to use.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage menus for your events</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="structure" className="flex items-center gap-2">
                <ListTree className="h-4 w-4" />
                Structure
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Guide
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'structure' && (
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search menu items..."
                    className="pl-9 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {sections.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="bg-white flex items-center gap-2"
                    onClick={() => setActiveTab('templates')}
                  >
                    <Package className="h-4 w-4" />
                    Import More
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <TabsContent value="structure" className="space-y-6">
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
                className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg bg-white"
              >
                <div className="max-w-md text-center space-y-4">
                  <div className="bg-blue-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
                    <ListTree className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium">No Menu Structure Yet</h3>
                  <p className="text-gray-500">
                    Get started by importing a template or creating your menu structure from scratch.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
                    <Button 
                      onClick={() => setActiveTab('templates')}
                      className="w-full sm:w-auto flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Use Template
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={() => {
                        const btn = document.getElementById('add-section-button');
                        if (btn) btn.click();
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Create Manually
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card className="bg-white shadow-sm border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Menu Structure</CardTitle>
                  <CardDescription>
                    Manage sections, choices, and items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MenuSectionsManager />
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            {isImporting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto bg-white p-8 rounded-lg border shadow-sm"
              >
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {selectedTemplate && 
                        templates.find(t => t.id === selectedTemplate)?.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Importing Template</h3>
                  <p className="text-gray-500 mb-6">
                    {selectedTemplate && 
                      templates.find(t => t.id === selectedTemplate)?.title}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Import progress</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="h-2" />
                </div>
                
                <p className="text-center text-sm text-gray-400 italic mt-6">
                  This will only take a moment...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Menu Templates</h2>
                  <p className="text-muted-foreground">
                    Select a template to quickly set up your menu structure
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {templates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all",
                        template.color
                      )}
                      onClick={() => {
                        // Confirm before importing
                        setSelectedTemplate(template.id);
                        document.getElementById(`confirm-${template.id}`)?.click();
                      }}
                    >
                      <div className="h-32 bg-white flex items-center justify-center">
                        {template.icon}
                      </div>
                      
                      <div className="p-4 bg-white border-t">
                        <h3 className="font-medium text-lg mb-1">{template.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        {template.categories.length > 0 ? (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500">Includes:</p>
                            <div className="space-y-1">
                              {template.categories.map((category, i) => (
                                <div key={i} className="flex items-center text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                  <span className="text-gray-700 truncate">{category}</span>
                                </div>
                              )).slice(0, 3)}
                              
                              {template.categories.length > 3 && (
                                <div className="text-xs text-gray-500">
                                  +{template.categories.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="py-2 flex items-center justify-center">
                            <p className="text-xs text-gray-500 italic">Build custom structure</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white border-t border-gray-100">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-sm w-full flex justify-center"
                        >
                          <span>Use Template</span>
                          <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                      
                      {/* Hidden trigger for confirmation dialog */}
                      <AlertDialogTrigger 
                        id={`confirm-${template.id}`} 
                        className="hidden"
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Confirmation dialog */}
                <AlertDialog>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Import Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        {selectedTemplate && (
                          <>
                            Are you sure you want to import the {templates.find(t => t.id === selectedTemplate)?.title} template?
                            {sections.length > 0 && (
                              <p className="mt-2 text-amber-600">
                                Your existing menu structure will not be deleted, but this will add new sections.
                              </p>
                            )}
                          </>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setSelectedTemplate(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          if (selectedTemplate) {
                            importTemplate(selectedTemplate);
                          }
                        }}
                      >
                        Import
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-6">
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle>Menu Management Guide</CardTitle>
                <CardDescription>
                  Learn how to effectively manage your menu structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Understanding Menu Structure</h3>
                  <p>Your menu is organized in a three-level hierarchy:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-blue-50 border-blue-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Main menu categories (e.g., "Starters", "Main Courses")</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 border-green-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Choices</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Options within sections (e.g., "Buffet Menu", "Plated Menu")</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-purple-50 border-purple-100">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Individual menu items within choices, organized by categories</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">Using Templates</h3>
                  <p>The fastest way to create your menu structure is by using a template:</p>
                  
                  <div className="bg-white p-4 rounded-md border border-gray-200 mt-3">
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                      <li className="text-gray-700">Select a template from the available options</li>
                      <li className="text-gray-700">Confirm to import the template structure</li>
                      <li className="text-gray-700">Customize the sections, choices, and items as needed</li>
                    </ol>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-100">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>
                    You can combine multiple templates to create a comprehensive menu
                    structure. Each template will add new sections without removing existing ones.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenuManagement;
