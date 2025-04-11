import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Check, ChevronRight } from "lucide-react";
import { 
  createMenuSection, 
  createMenuChoice, 
  createMenuItem, 
  MenuSectionFormData, 
  MenuChoiceFormData,
  MenuItemFormData,
  fetchMenuSections
} from '@/api/menuItemsApi';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toSlug } from '@/utils/menuStructureUtils';

// Define the structure for menu templates
interface MenuItem {
  label: string;
  value: string;
  category?: string | null;
}

interface MenuChoice {
  label: string;
  value: string;
  items: MenuItem[];
}

interface MenuSection {
  label: string;
  value: string;
  choices: MenuChoice[];
}

interface MenuTemplate {
  name: string;
  description: string;
  sections: MenuSection[];
}

// Pre-defined menu templates based on the PDF
const menuTemplates: MenuTemplate[] = [
  {
    name: "Event Package 2025",
    description: "Complete menu structure for the 2025 Event Package",
    sections: [
      {
        label: "Arrival and Starter Options",
        value: "arrival-starters",
        choices: [
          {
            label: "Harvest Table",
            value: "harvest-table",
            items: [
              {
                label: "The Warm Karoo Harvest Table",
                value: "warm-karoo-harvest-table",
                category: null
              }
            ]
          },
          {
            label: "Arrival Canisters",
            value: "arrival-canisters",
            items: [
              { label: "Infused Water", value: "infused-water" },
              { label: "Pink Lemonade", value: "pink-lemonade" },
              { label: "Fruit Juice", value: "fruit-juice" },
              { label: "Minty Mojito", value: "minty-mojito" }
            ]
          },
          {
            label: "Arrival Canapés",
            value: "arrival-canapes",
            items: [
              { label: "Beef & brie sliders with caramelised onion & tomato chutney", value: "beef-brie-sliders" },
              { label: "Bobotie springroll served with homemade chutney", value: "bobotie-springroll" },
              { label: "Melon & parma ham skewers", value: "melon-parma-ham" },
              { label: "Ricotta and Roasted Grape Crostini", value: "ricotta-grape-crostini" },
              { label: "Sticky ginger & soy chicken satay", value: "chicken-satay" },
              { label: "Bruschetta with roasted peppers, tomato & basil", value: "bruschetta" },
              { label: "Koftas with cucumber and mint yoghurt", value: "koftas" },
              { label: "Tomato, mozzarella & basil skewers", value: "caprese-skewers" },
              { label: "Crumbed prawn with sweet Asian dipping sauce", value: "crumbed-prawn" },
              { label: "Pulled pork mini pitas with sour cream & pickled onion", value: "pulled-pork-pitas" }
            ]
          },
          {
            label: "Plated Starter",
            value: "plated-starter",
            items: [
              { label: "Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with sourdough bread", value: "soup" },
              { label: "Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette", value: "caprese-crostini" },
              { label: "Classic seafood cocktail served on fresh cos lettuce", value: "seafood-cocktail" },
              { label: "Wild mushroom and black truffle risotto", value: "mushroom-risotto" },
              { label: "Fresh asparagus, hickory ham & brie pastry parcel", value: "asparagus-parcel" },
              { label: "Phyllo basket with spinach and feta", value: "phyllo-basket" },
              { label: "Grilled halloumi fingers with lime yogurt & pomegranate", value: "halloumi-fingers" },
              { label: "Spiced butternut & beetroot salad with feta, seeds and a citrus dressing", value: "butternut-beetroot-salad" }
            ]
          }
        ]
      },
      {
        label: "Main Course Options",
        value: "main-courses",
        choices: [
          {
            label: "Buffet Menu",
            value: "buffet-menu",
            items: [
              { label: "Homemade chicken pie", value: "chicken-pie", category: "MEAT SELECTION" },
              { label: "Roasted lemon & herb chicken thighs with chimichurri", value: "chicken-thighs", category: "MEAT SELECTION" },
              { label: "Leg of lamb with a rich jus", value: "leg-of-lamb", category: "MEAT SELECTION" },
              { label: "Beef fillet medallions in creamy wild mushroom sauce", value: "beef-fillet", category: "MEAT SELECTION" },
              { label: "Slow roasted oxtail pie", value: "oxtail-pie", category: "MEAT SELECTION" },
              { label: "Glazed gammon with sticky mustard & apple sauce", value: "glazed-gammon", category: "MEAT SELECTION" },
              
              { label: "Creamed green beans with potato and bacon", value: "green-beans", category: "VEGETABLES" },
              { label: "Pumpkin fritters in a sweet caramel custard", value: "pumpkin-fritters", category: "VEGETABLES" },
              { label: "Sweet potato bake with an almond & coconut crust", value: "sweet-potato-bake", category: "VEGETABLES" },
              { label: "Creamed spinach tart", value: "spinach-tart", category: "VEGETABLES" },
              { label: "Cheesy cauliflower & parmesan gratin", value: "cauliflower-gratin", category: "VEGETABLES" },
              { label: "Seasonal roast vegetables", value: "roast-vegetables", category: "VEGETABLES" },
              
              { label: "Baby potatoes in garlic & rosemary butter", value: "baby-potatoes", category: "STARCH SELECTION" },
              { label: "Parmesan roasted potato wedges", value: "potato-wedges", category: "STARCH SELECTION" },
              { label: "Buttery potato mash or creamy polenta", value: "potato-mash", category: "STARCH SELECTION" },
              { label: "Mixed pepper-flavoured basmati rice", value: "pepper-rice", category: "STARCH SELECTION" },
              { label: "White or brown wild rice with fresh herbs", value: "wild-rice", category: "STARCH SELECTION" },
              { label: "Mediterranean couscous or bulgur wheat", value: "couscous", category: "STARCH SELECTION" },
              
              { label: "Asian coleslaw with sesame dressing", value: "asian-coleslaw", category: "SALAD" },
              { label: "Caprese salad (tomato, mozzarella, basil)", value: "caprese-salad", category: "SALAD" },
              { label: "Creamy broccoli & bacon salad", value: "broccoli-bacon-salad", category: "SALAD" },
              { label: "Grilled halloumi and grape salad", value: "halloumi-grape-salad", category: "SALAD" },
              { label: "Mixed green leaves with a mustard vinaigrette dressing", value: "mixed-green-salad", category: "SALAD" },
              { label: "Strawberry, beetroot & pecan nut salad with balsamic glaze", value: "strawberry-beetroot-salad", category: "SALAD" },
              { label: "Traditional greek salad", value: "greek-salad", category: "SALAD" },
              { label: "Traditional pickled baby beetroot salad", value: "beetroot-salad", category: "SALAD" },
              { label: "Watermelon, feta & mint salad", value: "watermelon-salad", category: "SALAD" }
            ]
          },
          {
            label: "Warm Karoo Feast",
            value: "warm-karoo-feast",
            items: [
              { label: "Slow roasted leg of lamb and homemade chicken pie", value: "lamb-chicken-pie", category: "MEAT SELECTION" },
              { label: "Homemade oxtail pie and roasted golden-brown chickens", value: "oxtail-pie-chicken", category: "MEAT SELECTION" },
              
              { label: "Traditional roast potatoes", value: "roast-potatoes", category: "STARCH SELECTION" },
              { label: "Parmesan roasted potato wedges", value: "potato-wedges", category: "STARCH SELECTION" },
              { label: "Basmati rice", value: "basmati-rice", category: "STARCH SELECTION" },
              { label: "Mixed pepper-flavoured basmati rice", value: "pepper-rice", category: "STARCH SELECTION" },
              
              { label: "Green beans with butter & cream", value: "green-beans", category: "VEGETABLES" },
              { label: "Cauliflower and cheese sauce", value: "cauliflower-cheese", category: "VEGETABLES" },
              { label: "Traditional caramelised sweet potatoes", value: "sweet-potatoes", category: "VEGETABLES" },
              { label: "Pumpkin fritters in a sweet caramel custard", value: "pumpkin-fritters", category: "VEGETABLES" },
              { label: "Seasonal roast vegetables", value: "roast-vegetables", category: "VEGETABLES" },
              
              { label: "Asian coleslaw with sesame dressing", value: "asian-coleslaw", category: "SALAD" },
              { label: "Caprese salad (tomato, mozzarella, basil)", value: "caprese-salad", category: "SALAD" },
              { label: "Creamy broccoli & bacon salad", value: "broccoli-bacon-salad", category: "SALAD" },
              { label: "Grilled halloumi and grape salad", value: "halloumi-grape-salad", category: "SALAD" },
              { label: "Mixed green leaves with a mustard vinaigrette dressing", value: "mixed-green-salad", category: "SALAD" },
              { label: "Strawberry, beetroot & pecan nut salad with balsamic glaze", value: "strawberry-beetroot-salad", category: "SALAD" },
              { label: "Traditional greek salad", value: "greek-salad", category: "SALAD" },
              { label: "Traditional pickled baby beetroot salad", value: "beetroot-salad", category: "SALAD" },
              { label: "Watermelon, feta & mint salad", value: "watermelon-salad", category: "SALAD" }
            ]
          },
          {
            label: "Plated Menu",
            value: "plated-menu",
            items: [
              { label: "Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato served with crisp broccoli stems and honey-roasted carrots", value: "lamb-shank", category: "MAIN SELECTION" },
              { label: "Chef's cut of beef, whole green beans and potatoes wedges roasted in duck fat with parmesan & thyme. Served with mushroom or pepper sauce", value: "beef-cut", category: "MAIN SELECTION" },
              { label: "Sun-dried tomato & feta-stuffed chicken breast in a basil cream sauce with mediterranean couscous & seasonal roast vegetables", value: "stuffed-chicken", category: "MAIN SELECTION" },
              { label: "Moroccan pulled lamb on a potato rösti served with honey-roasted sweet potato and crème fraîche", value: "moroccan-lamb", category: "MAIN SELECTION" },
              
              { label: "Asian coleslaw with sesame dressing", value: "asian-coleslaw", category: "SALAD" },
              { label: "Caprese salad (tomato, mozzarella, basil)", value: "caprese-salad", category: "SALAD" },
              { label: "Creamy broccoli & bacon salad", value: "broccoli-bacon-salad", category: "SALAD" },
              { label: "Grilled halloumi and grape salad", value: "halloumi-grape-salad", category: "SALAD" },
              { label: "Mixed green leaves with a mustard vinaigrette dressing", value: "mixed-green-salad", category: "SALAD" },
              { label: "Strawberry, beetroot & pecan nut salad with balsamic glaze", value: "strawberry-beetroot-salad", category: "SALAD" },
              { label: "Traditional greek salad", value: "greek-salad", category: "SALAD" },
              { label: "Traditional pickled baby beetroot salad", value: "beetroot-salad", category: "SALAD" },
              { label: "Watermelon, feta & mint salad", value: "watermelon-salad", category: "SALAD" }
            ]
          }
        ]
      },
      {
        label: "Dessert Options",
        value: "dessert-options",
        choices: [
          {
            label: "Traditional Baked Desserts",
            value: "baked-desserts",
            items: [
              { label: "Self-saucing chocolate pudding", value: "chocolate-pudding" },
              { label: "Date & nut brandy pudding", value: "date-pudding" },
              { label: "Traditional malva pudding", value: "malva-pudding" },
              { label: "Baked apple caramel pudding", value: "apple-pudding" },
              { label: "Baked almond pudding with citrus & cinnamon syrup", value: "almond-pudding" }
            ]
          },
          {
            label: "Dessert Canapés",
            value: "dessert-canapes",
            items: [
              { label: "Carrot cupcakes with mascarpone frosting", value: "carrot-cupcakes" },
              { label: "Chocolate brownies", value: "chocolate-brownies" },
              { label: "Dark chocolate ganache cupcakes", value: "ganache-cupcakes" },
              { label: "Dark or white chocolate mousse", value: "chocolate-mousse" },
              { label: "Lemon meringues", value: "lemon-meringues" },
              { label: "Milk tartlets", value: "milk-tartlets" },
              { label: "Pecan nut pies", value: "pecan-pies" },
              { label: "Peppermint crisp treat", value: "peppermint-crisp" },
              { label: "Red velvet cupcakes with cream cheese frosting", value: "red-velvet-cupcakes" },
              { label: "Traditional koeksisters", value: "koeksisters" },
              { label: "Vanilla cupcakes with sweet butter frosting", value: "vanilla-cupcakes" }
            ]
          },
          {
            label: "Individual Cakes",
            value: "individual-cakes",
            items: [
              { label: "Baked cheesecake", value: "baked-cheesecake" },
              { label: "Lemon curd and berry pavlova", value: "lemon-pavlova" },
              { label: "Rich chocolate cake with dark chocolate ganache", value: "chocolate-cake" },
              { label: "Carrot cake with cream cheese frosting", value: "carrot-cake" },
              { label: "Lemon & poppyseed cake with cream and mascarpone", value: "lemon-poppyseed" }
            ]
          },
          {
            label: "Dessert Bar",
            value: "dessert-bar",
            items: [
              { label: "Warm Karoo Dessert Bar", value: "warm-karoo-dessert-bar" }
            ]
          }
        ]
      }
    ]
  }
];

// Template card component for selectable menu templates
const TemplateCard = ({ 
  template, 
  onSelect, 
  isSelected 
}: { 
  template: MenuTemplate; 
  onSelect: () => void; 
  isSelected: boolean 
}) => (
  <Card 
    className={`cursor-pointer transition-all duration-200 ${
      isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-300"
    }`}
    onClick={onSelect}
  >
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center">
        {template.name}
        {isSelected && <Check className="ml-2 h-5 w-5 text-primary" />}
      </CardTitle>
      <CardDescription>{template.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="text-sm space-y-1">
        {template.sections.map((section, i) => (
          <li key={i} className="text-muted-foreground">
            {section.label} ({section.choices.length} categories)
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button 
        variant={isSelected ? "default" : "outline"} 
        className="w-full"
      >
        {isSelected ? "Selected" : "Select Template"}
      </Button>
    </CardFooter>
  </Card>
);

// Main component
const MenuTemplateImporter = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MenuTemplate | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<string>("");
  const [importComplete, setImportComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("templates");

  // Calculate the total number of items to import
  const calculateTotalItems = (template: MenuTemplate) => {
    let total = 0;
    total += template.sections.length; // Sections
    
    // Count choices
    template.sections.forEach(section => {
      total += section.choices.length;
      
      // Count items
      section.choices.forEach(choice => {
        total += choice.items.length;
      });
    });
    
    return total;
  };

  // Generate a unique value for section if it already exists
  const makeUniqueValue = (baseValue: string, existing: string[]): string => {
    if (!existing.includes(baseValue)) return baseValue;
    
    let counter = 1;
    let newValue = `${baseValue}-${counter}`;
    
    while (existing.includes(newValue)) {
      counter++;
      newValue = `${baseValue}-${counter}`;
    }
    
    return newValue;
  };

  // Import the selected template
  const importTemplate = async () => {
    if (!selectedTemplate) return;
    
    setImporting(true);
    setImportProgress(0);
    setImportStatus("Starting import...");
    setImportComplete(false);
    
    const totalItems = calculateTotalItems(selectedTemplate);
    let importedItems = 0;
    
    try {
      // First fetch existing sections to avoid conflicts
      setImportStatus("Checking existing menu structure...");
      const existingSections = await fetchMenuSections();
      const existingSectionValues = existingSections.map(section => section.value);
      
      // Track created sections and choices for this import operation
      const createdSections: Record<string, string> = {};
      
      // Import each section
      for (const section of selectedTemplate.sections) {
        setImportStatus(`Importing section: ${section.label}`);
        
        // Create a unique value if needed
        const uniqueSectionValue = makeUniqueValue(section.value, existingSectionValues);
        if (uniqueSectionValue !== section.value) {
          console.log(`Section value "${section.value}" already exists, using "${uniqueSectionValue}" instead`);
        }
        
        // Create the section
        const sectionData: MenuSectionFormData = {
          label: section.label,
          value: uniqueSectionValue,
          display_order: 0 // This will be set automatically
        };
        
        try {
          const createdSection = await createMenuSection(sectionData);
          // Store the mapping between template section value and created section id
          createdSections[section.value] = createdSection.id;
          importedItems++;
          setImportProgress(Math.floor((importedItems / totalItems) * 100));
          
          // Import choices for this section
          for (const choice of section.choices) {
            setImportStatus(`Importing choice: ${choice.label}`);
            
            // Create the choice
            const choiceData: MenuChoiceFormData = {
              section_id: createdSection.id,
              label: choice.label,
              value: choice.value,
              display_order: 0, // This will be set automatically
              choice_type: "menu"
            };
            
            const createdChoice = await createMenuChoice(choiceData);
            importedItems++;
            setImportProgress(Math.floor((importedItems / totalItems) * 100));
            
            // Import items for this choice
            for (const item of choice.items) {
              setImportStatus(`Importing item: ${item.label}`);
              
              // Create the item
              const itemData: MenuItemFormData = {
                label: item.label,
                value: item.value,
                category: item.category || null,
                choice_id: createdChoice.id,
                image_url: null,
                display_order: 0 // This will be set automatically
              };
              
              await createMenuItem(itemData);
              importedItems++;
              setImportProgress(Math.floor((importedItems / totalItems) * 100));
            }
          }
        } catch (error) {
          console.error(`Error creating section "${section.label}":`, error);
          // Continue with the next section instead of stopping the entire import
          toast.error(`Failed to import section "${section.label}"`, {
            description: "Import will continue with remaining sections"
          });
        }
      }
      
      setImportStatus("Import completed successfully!");
      setImportComplete(true);
      toast.success("Menu template imported", {
        description: "Your menu template has been successfully imported."
      });
    } catch (error) {
      console.error("Error importing template:", error);
      setImportStatus(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast.error("Import failed", {
        description: "There was an error importing the template. Please try again."
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="import" disabled={!selectedTemplate}>Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Select a Menu Template</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuTemplates.map((template, i) => (
              <TemplateCard
                key={i}
                template={template}
                onSelect={() => setSelectedTemplate(template)}
                isSelected={selectedTemplate?.name === template.name}
              />
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="flex justify-end">
              <Button 
                onClick={() => setActiveTab("import")}
                className="flex items-center"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="import" className="space-y-6">
          {selectedTemplate && (
            <>
              <h2 className="text-xl font-semibold">Import Template: {selectedTemplate.name}</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Template Structure</CardTitle>
                  <CardDescription>
                    Review what will be imported to your menu system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedTemplate.sections.map((section, i) => (
                      <div key={i} className="border rounded-md p-4">
                        <h3 className="font-medium mb-2">{section.label}</h3>
                        <div className="pl-4 space-y-3">
                          {section.choices.map((choice, j) => (
                            <div key={j}>
                              <h4 className="text-sm font-medium mb-1">{choice.label}</h4>
                              <ul className="pl-4 text-sm text-muted-foreground">
                                {choice.items.map((item, k) => (
                                  <li key={k} className="list-disc list-inside">
                                    {item.label} {item.category && <span className="text-xs text-gray-400">({item.category})</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("templates")}>
                    Back to Templates
                  </Button>
                  <Button onClick={importTemplate} disabled={importing}>
                    {importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Import Template
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              {importing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Import Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={importProgress} />
                    <p className="text-sm text-center">{importStatus}</p>
                  </CardContent>
                </Card>
              )}
              
              {importComplete && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Template import completed successfully! You can now manage your menu items, choices, and sections.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MenuTemplateImporter;
