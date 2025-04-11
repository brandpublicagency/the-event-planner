
import { 
  MenuSection, 
  MenuChoice, 
  MenuItem, 
  MenuSectionFormData,
  MenuChoiceFormData,
  MenuItemFormData 
} from '@/api/menuItemsApi';

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

// Convert menu template to API format
export const convertTemplateToApiFormat = (template: MenuTemplateData): {
  sections: MenuSectionFormData[];
  choices: (MenuChoiceFormData & { sectionIndex: number })[];
  items: (MenuItemFormData & { choiceIndex: number })[];
} => {
  const sections: MenuSectionFormData[] = [];
  const choices: (MenuChoiceFormData & { sectionIndex: number })[] = [];
  const items: (MenuItemFormData & { choiceIndex: number })[] = [];

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
        section_id: '', // Will be filled in after sections are created
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
              choice_id: '', // Will be filled in after choices are created
              image_url: null,
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
            choice_id: '', // Will be filled in after choices are created
            image_url: null,
            choiceIndex: choices.length - 1,
            display_order: itemIndex
          });
        });
      }
    });
  });

  return { sections, choices, items };
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

// Group menu items by category
export const groupItemsByCategory = (menuItems: MenuItem[]): Record<string, MenuItem[]> => {
  const categories: Record<string, MenuItem[]> = { uncategorized: [] };
  
  menuItems.forEach(item => {
    const category = item.category || 'uncategorized';
    
    if (!categories[category]) {
      categories[category] = [];
    }
    
    categories[category].push(item);
  });
  
  return categories;
};

// Helper to check if a menu choice should use categories
export const shouldUseCategories = (choice: MenuChoice, items?: MenuItem[]): boolean => {
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
  switch (choiceValue) {
    case 'buffet-menu':
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    case 'warm-karoo-feast':
      return ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"];
    case 'plated-menu':
      return ["MAIN SELECTION", "SALAD"];
    case 'starters':
    case 'plated-starter':
      return ["STARTERS"];
    case 'dessert-canapes':
      return ["DESSERT CANAPÉS"];
    case 'individual-cakes':
      return ["INDIVIDUAL CAKES"];
    case 'baked-desserts':
      return ["BAKED DESSERTS"];
    default:
      return [];
  }
};

// Export the getPredefinedCategories function to fix build error
export const getPredefinedCategories = (): Record<string, string[]> => {
  return {
    'buffet-menu': ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"],
    'warm-karoo-feast': ["MEAT SELECTION", "VEGETABLES", "STARCH SELECTION", "SALAD"],
    'plated-menu': ["MAIN SELECTION", "SALAD"],
    'starters': ["STARTERS"],
    'plated-starter': ["STARTERS"],
    'dessert-canapes': ["DESSERT CANAPÉS"],
    'individual-cakes': ["INDIVIDUAL CAKES"],
    'baked-desserts': ["BAKED DESSERTS"]
  };
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
