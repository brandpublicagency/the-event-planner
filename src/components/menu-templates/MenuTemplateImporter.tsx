
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageOpen, Check, AlertCircle, Info, FileText, ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createMenuSection, createMenuChoice, createMenuItem, MenuItemFormData } from "@/api/menuItemsApi";
import { toSlug, getPredefinedCategories } from "@/utils/menuStructureUtils";
import { useMenuSections } from "@/hooks/useMenuSections";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';

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

  const importTemplate = async () => {
    const template = getSelectedTemplateData();
    if (!template) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);
    
    try {
      const stats = {sections: 0, choices: 0, items: 0};
      
      // Check for duplicate sections
      const sectionValues = existingSections.map(s => s.value);
      const hasDuplicates = template.sections.some(s => sectionValues.includes(toSlug(s.label)));
      
      if (hasDuplicates) {
        throw new Error("Some sections from this template already exist in your menu structure.");
      }
      
      // Import sections, choices, and items
      for (const section of template.sections) {
        // Create section
        const sectionData = {
          label: section.label,
          value: toSlug(section.label),
          display_order: existingSections.length + stats.sections
        };
        
        const createdSection = await createMenuSection(sectionData);
        stats.sections++;
        
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
    }
  };

  const selectedTemplateData = getSelectedTemplateData();

  return (
    <div className="space-y-6">
      {importError && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Import Failed</AlertTitle>
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}
      
      {importSuccess && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4" />
          <AlertTitle>Import Successful</AlertTitle>
          <AlertDescription>
            Created {importStats.sections} sections, {importStats.choices} choices, and {importStats.items} items.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
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
              <div key={template.id} className={`flex items-start space-x-3 border rounded-lg p-4 ${
                selectedTemplate === template.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}>
                <RadioGroupItem value={template.id} id={template.id} />
                <div className="flex-1">
                  <Label 
                    htmlFor={template.id} 
                    className={`text-base font-medium ${selectedTemplate === template.id ? 'text-blue-800' : ''}`}
                  >
                    {template.name}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
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
            className="min-w-[120px]"
          >
            {isImporting ? (
              <span className="flex items-center">
                Importing...
              </span>
            ) : (
              <span className="flex items-center">
                <PackageOpen className="h-4 w-4 mr-2" />
                Import
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Separator className="my-8" />
      
      <div className="text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">Custom Templates</h3>
        <p>You can create a custom template by exporting your existing menu structure, modifying it, and then importing it back.</p>
        <p className="mt-2">To export your menu structure, contact the system administrator.</p>
      </div>
    </div>
  );
};

export default MenuTemplateImporter;
