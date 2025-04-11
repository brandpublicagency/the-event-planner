
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageOpen, Check, AlertCircle, Info, FileText, ChevronRight, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createMenuSection, createMenuChoice, createMenuItem, MenuItemFormData } from "@/api/menuItemsApi";
import { toSlug, getPredefinedCategories, generateUniqueValue } from "@/utils/menuStructureUtils";
import { useMenuSections } from "@/hooks/useMenuSections";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  {
    id: 'wedding-standard',
    name: 'Wedding Standard Menu',
    description: 'A comprehensive wedding menu including starters, mains, and desserts',
    sections: [
      {
        label: 'Starters',
        choices: [
          {
            label: 'Canapés',
            items: [
              { label: 'Mini Quiches', category: 'HOT CANAPÉS' },
              { label: 'Spring Rolls', category: 'HOT CANAPÉS' },
              { label: 'Stuffed Mushrooms', category: 'HOT CANAPÉS' },
              { label: 'Bruschetta', category: 'COLD CANAPÉS' },
              { label: 'Smoked Salmon Blinis', category: 'COLD CANAPÉS' },
              { label: 'Tomato & Mozzarella Skewers', category: 'COLD CANAPÉS' }
            ]
          },
          {
            label: 'Plated Starters',
            items: [
              { label: 'Prawn Cocktail' },
              { label: 'Smoked Salmon Terrine' },
              { label: 'Caprese Salad' },
              { label: 'Wild Mushroom Soup' },
              { label: 'Butternut Squash Soup' }
            ]
          }
        ]
      },
      {
        label: 'Main Courses',
        choices: [
          {
            label: 'Buffet Menu',
            items: [
              { label: 'Roast Beef', category: 'MEAT SELECTION' },
              { label: 'Roast Chicken', category: 'MEAT SELECTION' },
              { label: 'Pork Belly', category: 'MEAT SELECTION' },
              { label: 'Grilled Fish', category: 'MEAT SELECTION' },
              { label: 'Roast Potatoes', category: 'STARCH SELECTION' },
              { label: 'Rice Pilaf', category: 'STARCH SELECTION' },
              { label: 'Creamy Mashed Potatoes', category: 'STARCH SELECTION' },
              { label: 'Grilled Vegetables', category: 'VEGETABLES' },
              { label: 'Steamed Broccoli', category: 'VEGETABLES' },
              { label: 'Glazed Carrots', category: 'VEGETABLES' },
              { label: 'Green Salad', category: 'SALAD' },
              { label: 'Coleslaw', category: 'SALAD' },
              { label: 'Pasta Salad', category: 'SALAD' }
            ]
          },
          {
            label: 'Plated Menu',
            items: [
              { label: 'Filet Mignon', category: 'MAIN SELECTION' },
              { label: 'Salmon with Lemon Butter', category: 'MAIN SELECTION' },
              { label: 'Chicken Supreme', category: 'MAIN SELECTION' },
              { label: 'Vegetable Wellington', category: 'MAIN SELECTION' },
              { label: 'Caesar Salad', category: 'SALAD' },
              { label: 'Greek Salad', category: 'SALAD' },
              { label: 'Seasonal Mixed Salad', category: 'SALAD' }
            ]
          }
        ]
      },
      {
        label: 'Desserts',
        choices: [
          {
            label: 'Traditional Desserts',
            items: [
              { label: 'Wedding Cake' },
              { label: 'Chocolate Fountain' },
              { label: 'Tiramisu' },
              { label: 'Cheesecake' },
              { label: 'Fruit Tart' }
            ]
          },
          {
            label: 'Dessert Canapés',
            items: [
              { label: 'Mini Eclairs', category: 'DESSERT CANAPÉS' },
              { label: 'Chocolate Truffles', category: 'DESSERT CANAPÉS' },
              { label: 'Fruit Skewers', category: 'DESSERT CANAPÉS' },
              { label: 'Mini Cheesecakes', category: 'DESSERT CANAPÉS' },
              { label: 'Macarons', category: 'DESSERT CANAPÉS' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'corporate-events',
    name: 'Corporate Events Menu',
    description: 'Perfect for business meetings, conferences, and corporate gatherings',
    sections: [
      {
        label: 'Breakfast',
        choices: [
          {
            label: 'Continental Breakfast',
            items: [
              { label: 'Croissants' },
              { label: 'Danish Pastries' },
              { label: 'Fruit Platter' },
              { label: 'Yogurt Parfait' },
              { label: 'Granola Bars' }
            ]
          },
          {
            label: 'Hot Breakfast',
            items: [
              { label: 'Scrambled Eggs' },
              { label: 'Bacon' },
              { label: 'Sausages' },
              { label: 'Hash Browns' },
              { label: 'Pancakes' }
            ]
          }
        ]
      },
      {
        label: 'Lunch',
        choices: [
          {
            label: 'Sandwich Platters',
            items: [
              { label: 'Chicken & Avocado' },
              { label: 'Egg & Cress' },
              { label: 'Tuna Mayonnaise' },
              { label: 'Ham & Cheese' },
              { label: 'Veggie Deluxe' }
            ]
          },
          {
            label: 'Hot Lunch Buffet',
            items: [
              { label: 'Lasagna', category: 'MAINS' },
              { label: 'Chicken Curry', category: 'MAINS' },
              { label: 'Beef Stir Fry', category: 'MAINS' },
              { label: 'Vegetable Pasta', category: 'MAINS' },
              { label: 'Rice', category: 'SIDES' },
              { label: 'Roasted Vegetables', category: 'SIDES' },
              { label: 'Mixed Salad', category: 'SIDES' },
              { label: 'Garlic Bread', category: 'SIDES' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'warm-karoo-special',
    name: 'Warm Karoo Special Menu',
    description: 'Authentic Karoo flavors for special occasions and celebrations',
    sections: [
      {
        label: 'Starters',
        choices: [
          {
            label: 'Light Starters',
            items: [
              { label: 'Karoo Biltong Soup' },
              { label: 'Roasted Butternut & Feta Salad' },
              { label: 'Wild Mushroom Bruschetta' },
              { label: 'Venison Carpaccio' }
            ]
          }
        ]
      },
      {
        label: 'Main Course',
        choices: [
          {
            label: 'Warm Karoo Feast',
            items: [
              { label: 'Karoo Lamb Chops', category: 'MEAT SELECTION' },
              { label: 'Venison Potjie', category: 'MEAT SELECTION' },
              { label: 'Spiced Beef Ribeye', category: 'MEAT SELECTION' },
              { label: 'Ostrich Fillet', category: 'MEAT SELECTION' },
              { label: 'Pap & Sous', category: 'STARCH SELECTION' },
              { label: 'Saffron Rice', category: 'STARCH SELECTION' },
              { label: 'Roasted Sweet Potatoes', category: 'STARCH SELECTION' },
              { label: 'Gem Squash with Corn', category: 'VEGETABLES' },
              { label: 'Grilled Mixed Vegetables', category: 'VEGETABLES' },
              { label: 'Braised Red Cabbage', category: 'VEGETABLES' },
              { label: 'Farm Style Potato Salad', category: 'SALAD' },
              { label: 'Spiced Beetroot Salad', category: 'SALAD' },
              { label: 'Fresh Garden Salad', category: 'SALAD' }
            ]
          }
        ]
      },
      {
        label: 'Desserts',
        choices: [
          {
            label: 'Traditional South African',
            items: [
              { label: 'Milk Tart' },
              { label: 'Malva Pudding' },
              { label: 'Koeksisters' },
              { label: 'Peppermint Crisp Tart' }
            ]
          }
        ]
      }
    ]
  }
];

interface MenuTemplateImporterProps {
  onImportSuccess?: () => void;
}

const MenuTemplateImporter: React.FC<MenuTemplateImporterProps> = ({ onImportSuccess }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('wedding-standard');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<{sections: number, choices: number, items: number}>({
    sections: 0,
    choices: 0,
    items: 0
  });
  const { sections: existingSections, refetch } = useMenuSections();

  const handleTemplateSelection = (id: string) => {
    setSelectedTemplate(id);
    setImportError(null);
    setImportSuccess(false);
  };

  const getSelectedTemplateData = () => {
    return TEMPLATES.find(template => template.id === selectedTemplate);
  };

  const getSectionsTotalItems = (template: any) => {
    let total = 0;
    for (const section of template.sections) {
      total++; // Count the section
      for (const choice of section.choices) {
        total++; // Count the choice
        total += choice.items.length; // Count all items in this choice
      }
    }
    return total;
  };

  const importTemplate = async () => {
    const template = getSelectedTemplateData();
    if (!template) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    setImportProgress(0);
    
    try {
      const stats = {sections: 0, choices: 0, items: 0};
      const totalItemsToProcess = getSectionsTotalItems(template);
      let processedItems = 0;
      
      // Check for duplicate section values
      const sectionValues = existingSections.map(s => s.value);
      const duplicateSections = template.sections
        .filter(s => sectionValues.includes(toSlug(s.label)))
        .map(s => s.label);
      
      if (duplicateSections.length > 0) {
        throw new Error(`These sections already exist: ${duplicateSections.join(', ')}. Please remove them first or choose a different template.`);
      }
      
      // Import sections, choices, and items
      for (const section of template.sections) {
        // Generate a unique value for this section
        const sectionValue = generateUniqueValue(
          section.label, 
          existingSections.map(s => s.value)
        );
        
        // Create section
        const sectionData = {
          label: section.label,
          value: sectionValue,
          display_order: existingSections.length + stats.sections
        };
        
        const createdSection = await createMenuSection(sectionData);
        stats.sections++;
        processedItems++;
        setImportProgress(Math.round((processedItems / totalItemsToProcess) * 100));
        
        // Create choices for this section
        for (const [choiceIndex, choice] of section.choices.entries()) {
          const choiceData = {
            label: choice.label,
            value: toSlug(choice.label),
            section_id: createdSection.id,
            display_order: choiceIndex,
            choice_type: 'menu'
          };
          
          const createdChoice = await createMenuChoice(choiceData);
          stats.choices++;
          processedItems++;
          setImportProgress(Math.round((processedItems / totalItemsToProcess) * 100));
          
          // Create items for this choice
          for (const [itemIndex, item] of choice.items.entries()) {
            const itemData: MenuItemFormData = {
              label: item.label,
              value: toSlug(item.label),
              choice_id: createdChoice.id,
              category: (item as any).category || null,
              display_order: itemIndex,
              image_url: null,
            };
            
            await createMenuItem(itemData);
            stats.items++;
            processedItems++;
            setImportProgress(Math.round((processedItems / totalItemsToProcess) * 100));
          }
        }
      }
      
      setImportStats(stats);
      setImportSuccess(true);
      
      // Refresh sections after import
      if (refetch) {
        setTimeout(() => {
          refetch();
        }, 500);
      }
      
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      toast.success(`Template imported successfully! Created ${stats.sections} sections, ${stats.choices} choices, and ${stats.items} items.`);
    } catch (error: any) {
      console.error('Error importing template:', error);
      setImportError(error.message || 'Failed to import template');
      toast.error('Import failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsImporting(false);
      setImportProgress(100);
    }
  };

  const selectedTemplateData = getSelectedTemplateData();

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {importSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Import Successful</AlertTitle>
              <AlertDescription>
                Created {importStats.sections} sections, {importStats.choices} choices, and {importStats.items} items.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>
            Select a template to import a complete menu structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedTemplate} 
            onValueChange={handleTemplateSelection}
            className="space-y-3"
          >
            {TEMPLATES.map(template => (
              <div key={template.id} className={`flex items-start space-x-3 border rounded-lg p-4 transition-all duration-200 ${
                selectedTemplate === template.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                <div className="flex-1">
                  <Label 
                    htmlFor={template.id} 
                    className={`text-base font-medium ${selectedTemplate === template.id ? 'text-blue-800' : ''} cursor-pointer`}
                  >
                    {template.name}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          {isImporting && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing template...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="h-2" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-start border-t pt-6">
          <div className="w-2/3">
            {selectedTemplateData && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> 
                  Template Structure
                </h3>
                <div className="text-sm text-gray-600 space-y-1.5">
                  {selectedTemplateData.sections.map((section, index) => (
                    <div key={index} className="space-y-1">
                      <div className="font-medium flex items-center">
                        <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                        {section.label} 
                        <span className="text-gray-400 text-xs ml-1">
                          ({section.choices.length} choices)
                        </span>
                      </div>
                      <div className="ml-5 text-xs text-gray-500">
                        {section.choices.map((choice, i) => (
                          <div key={i}>• {choice.label} ({choice.items.length} items)</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button 
            onClick={importTemplate} 
            disabled={isImporting || !selectedTemplate}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isImporting ? (
              <span className="flex items-center">
                Importing...
              </span>
            ) : (
              <span className="flex items-center">
                <PackageOpen className="h-4 w-4 mr-2" />
                Import Template
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Separator className="my-8" />
      
      <div className="text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">Custom Templates</h3>
        <p>You can create a custom template by exporting your existing menu structure, modifying it, and then importing it back.</p>
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-blue-700">
              To export your menu structure or create a fully custom template, contact your account administrator
              or reach out to support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTemplateImporter;
