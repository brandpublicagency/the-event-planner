
import React, { useState, useEffect } from 'react';
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, Package, ListTree, Plus, ChefHat, 
  ArrowRight, Menu as MenuIcon, Layers, RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMenuSections } from '@/hooks/useMenuSections';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MenuSectionsManager } from '@/components/menu-items/MenuSectionsManager';
import { getPredefinedCategories } from '@/utils/menuStructureUtils';
import { Dialog } from '@/components/ui/dialog';

// Import new components
import TemplatesGrid from '@/components/menu-templates/TemplatesGrid';
import ImportProgress from '@/components/menu-templates/ImportProgress';
import EmptyStructure from '@/components/menu-management/EmptyStructure';
import SuccessAlert from '@/components/menu-management/SuccessAlert';

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
  
  const handleManualAddSection = () => {
    const btn = document.getElementById('add-section-button');
    if (btn) btn.click();
  };

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Menu Management" />
      
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        <SuccessAlert show={showSuccessAlert} />
        
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
              <EmptyStructure 
                onUseTemplate={() => setActiveTab('templates')}
                onCreateManually={handleManualAddSection}
              />
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
              <ImportProgress
                selectedTemplate={selectedTemplate}
                importProgress={importProgress}
                templates={templates}
              />
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold tracking-tight">Menu Templates</h2>
                  <p className="text-muted-foreground">
                    Select a template to quickly set up your menu structure
                  </p>
                </div>
                
                <TemplatesGrid 
                  templates={templates}
                  sections={sections}
                  onImportTemplate={importTemplate}
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenuManagement;
