
import { MenuItem } from '@/api/menuItemsApi';

// Function to group menu items by their categories
export const groupItemsByCategory = (items: MenuItem[]) => {
  const categoryGroups: Record<string, MenuItem[]> = {};
  
  items.forEach(item => {
    const category = item.category || 'uncategorized';
    if (!categoryGroups[category]) {
      categoryGroups[category] = [];
    }
    categoryGroups[category].push(item);
  });
  
  return categoryGroups;
};

// Function to get unique categories from a list of items
export const getUniqueCategories = (items: MenuItem[]): string[] => {
  const categories = items.map(item => item.category || 'uncategorized');
  return [...new Set(categories)].filter(Boolean);
};

// Function to get predefined categories based on menu type
export const getPredefinedCategories = (menuType: string): string[] => {
  switch (menuType.toLowerCase()) {
    case 'buffet-menu':
    case 'warm-karoo-feast':
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    case 'plated-menu':
      return ["MAIN SELECTION", "SALAD"];
    case 'dessert-canapes':
      return ["DESSERT CANAPÉS"];
    case 'individual-cakes':
      return ["INDIVIDUAL CAKES"];
    case 'baked-desserts':
      return ["BAKED DESSERTS"];
    case 'canapés':
      return ["CANAPÉS"];
    case 'plated-starter':
      return ["PLATED STARTER"];
    case 'harvest-table':
      return ["HARVEST TABLE"];
    default:
      return [];
  }
};

// Function to organize menu structure hierarchically
export const organizeMenuStructure = (sections: any[], choices: any[], items: MenuItem[]) => {
  const structure = sections.map(section => {
    const sectionChoices = choices.filter(choice => choice.section_id === section.id);
    
    const choicesWithItems = sectionChoices.map(choice => {
      const choiceItems = items.filter(item => item.choice_id === choice.id);
      const categories = groupItemsByCategory(choiceItems);
      
      return {
        ...choice,
        items: choiceItems,
        categories
      };
    });
    
    return {
      ...section,
      choices: choicesWithItems
    };
  });
  
  return structure;
};
