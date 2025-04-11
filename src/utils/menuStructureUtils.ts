
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
    case 'starters':
      return ["STARTERS"];
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

// Structure for mapping menu PDFs to app data
export interface MenuCategory {
  name: string;
  description?: string;
  items: MenuItemData[];
}

export interface MenuItemData {
  name: string;
  description?: string;
  price?: string;
  category?: string;
}

export interface MenuChoiceData {
  name: string;
  description?: string;
  categories?: MenuCategory[];
  items?: MenuItemData[];
}

export interface MenuSectionData {
  name: string;
  description?: string;
  choices: MenuChoiceData[];
}

export interface MenuTemplateData {
  name: string;
  description?: string;
  sections: MenuSectionData[];
}

// Convert string to kebab-case slug value
export const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper to check if a menu choice should use categories
export const shouldUseCategories = (choice: any, items?: MenuItem[]): boolean => {
  // These choice types are known to use categories
  const multiCategoryChoiceValues = [
    'buffet-menu',
    'warm-karoo-feast',
    'plated-menu',
    'dessert-canapes',
    'starters'
  ];
  
  // First check the choice value
  if (multiCategoryChoiceValues.includes(choice.value)) {
    return true;
  }
  
  // Then check existing items if provided
  if (items && items.length > 0) {
    // If any items have categories, this choice uses categories
    return items.some(item => item.category !== null);
  }
  
  // Default to false
  return false;
};

// Get appropriate categories for a choice
export const getCategoriesForChoice = (choiceValue: string): string[] => {
  return getPredefinedCategories(choiceValue);
};

// Helper to get a display-friendly name from a price code
export const getPriceDisplayName = (priceCode: string): string => {
  switch (priceCode) {
    case 'canapes-3':
      return "3 Canapés per person";
    case 'canapes-4':
      return "4 Canapés per person";
    case 'canapes-5':
      return "5 Canapés per person";
    case 'canapes-6':
      return "6 Canapés per person";
    default:
      return priceCode.replace(/-/g, ' ');
  }
};

// Extract unique categories from menu items
export const extractCategories = (menuItems: MenuItem[]): string[] => {
  const categoriesSet = new Set<string>();
  
  menuItems.forEach(item => {
    if (item.category) {
      categoriesSet.add(item.category);
    }
  });
  
  return Array.from(categoriesSet);
};

// Convert menu template to API format
export const convertTemplateToApiFormat = (template: MenuTemplateData): {
  sections: any[];
  choices: any[];
  items: any[];
} => {
  const sections: any[] = [];
  const choices: any[] = [];
  const items: any[] = [];

  // Process sections
  template.sections.forEach((section, sectionIndex) => {
    // Add section
    sections.push({
      label: section.name,
      value: toSlug(section.name),
      display_order: sectionIndex
    });

    // Process choices
    section.choices.forEach((choice, choiceIndex) => {
      // Add choice
      choices.push({
        label: choice.name,
        value: toSlug(choice.name),
        sectionIndex,
        display_order: choiceIndex
      });

      // Process items - either from categories or direct items
      if (choice.categories && choice.categories.length > 0) {
        // Items are organized into categories
        choice.categories.forEach(category => {
          category.items.forEach((item, itemIndex) => {
            items.push({
              label: item.name,
              value: toSlug(item.name),
              category: category.name,
              choiceIndex: choices.length - 1,
              display_order: itemIndex
            });
          });
        });
      } else if (choice.items && choice.items.length > 0) {
        // Items without categories
        choice.items.forEach((item, itemIndex) => {
          items.push({
            label: item.name,
            value: toSlug(item.name),
            category: item.category || null,
            choiceIndex: choices.length - 1,
            display_order: itemIndex
          });
        });
      }
    });
  });

  return { sections, choices, items };
};
