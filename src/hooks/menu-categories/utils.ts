
import { MenuItem } from '@/api/types/menuItems';
import { CATEGORY_MENU_TYPES, FIXED_CATEGORY_ORDER } from './constants';

// Determine if categorization should be used based on menu items
export const shouldUseCategorization = (items: MenuItem[]): boolean => {
  if (items.length === 0) return false;
  
  return items.some(item => {
    const choice = (item.choice || '').toLowerCase();
    return CATEGORY_MENU_TYPES.some(type => choice.includes(type));
  });
};

// Determine the menu type based on the choice value
export const determineMenuType = (items: MenuItem[]): string => {
  if (items.length === 0) return 'default';
  const choice = (items[0]?.choice || '').toLowerCase();
  
  if (choice.includes('karoo')) return 'karoo';
  if (choice.includes('buffet')) return 'buffet';
  if (choice.includes('plated')) return 'plated';
  if (choice.includes('sec-main') || choice.includes('sec_main') || 
      choice.includes('secondary main') || choice.includes('secondary-main') || 
      choice.includes('secmain') || choice.includes('secondary') || 
      choice.includes('main')) return 'sec-mains';
  return 'default';
};

// Extract the choice ID for database operations
export const getChoiceId = (items: MenuItem[]): string | null => {
  if (items.length === 0) return null;
  return items[0].choice_id;
};

// Get the base category name without numbers or brackets
export const getBaseCategory = (category: string): string => {
  return category.replace(/\s*\(\d+\)\s*$/, '').trim();
};

// Categorize menu items
export const categorizeItems = (items: MenuItem[], useCategorization: boolean): Record<string, MenuItem[]> => {
  if (!useCategorization) {
    return { 'Items': items };
  }

  return items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
};

// Get all unique categories and sort them
export const getAllCategories = (categorizedItems: Record<string, MenuItem[]>, useCategorization: boolean): string[] => {
  if (!useCategorization) return ['Items'];
  
  const categories = Object.keys(categorizedItems)
    .filter(category => categorizedItems[category].length > 0);
  
  console.log("All detected categories:", categories);
  return categories;
};

// Sort categories based on the menu type and fixed order
export const sortCategories = (
  allCategories: string[], 
  menuType: string
): string[] => {
  if (!menuType) return allCategories;
  
  const fixedOrder = FIXED_CATEGORY_ORDER[menuType as keyof typeof FIXED_CATEGORY_ORDER] || FIXED_CATEGORY_ORDER['default'];
  console.log(`Applying fixed category order for ${menuType}:`, fixedOrder);
  
  const sorted = [...allCategories].sort((a, b) => {
    // Always put Uncategorized at the end
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    
    // Special handling for categories that might have variations
    const aBaseCategory = getBaseCategory(a);
    const bBaseCategory = getBaseCategory(b);
    
    // For plated menus, ensure specific order: Plated Main Course first, then Salad
    if (menuType === 'plated') {
      if (aBaseCategory.includes('Plated Main Course') && !bBaseCategory.includes('Plated Main Course')) return -1;
      if (!aBaseCategory.includes('Plated Main Course') && bBaseCategory.includes('Plated Main Course')) return 1;
      if (aBaseCategory.includes('Salad') && !bBaseCategory.includes('Salad')) return 1;
      if (!aBaseCategory.includes('Salad') && bBaseCategory.includes('Salad')) return -1;
    }
    
    // Find matches in the fixed order for base categories
    const aMatches = fixedOrder.filter(item => item.startsWith(aBaseCategory));
    const bMatches = fixedOrder.filter(item => item.startsWith(bBaseCategory));
    
    const aIndex = aMatches.length > 0 ? 
                  fixedOrder.indexOf(aMatches[0]) : 
                  fixedOrder.findIndex(item => item.startsWith(aBaseCategory));
    
    const bIndex = bMatches.length > 0 ? 
                  fixedOrder.indexOf(bMatches[0]) : 
                  fixedOrder.findIndex(item => item.startsWith(bBaseCategory));
    
    // If both categories are in the fixed order, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    
    // If only a is in the fixed order, it comes first
    if (aIndex !== -1) {
      return -1;
    }
    
    // If only b is in the fixed order, it comes first
    if (bIndex !== -1) {
      return 1;
    }
    
    // If neither is in the fixed order, maintain alphabetical order
    return a.localeCompare(b);
  });
  
  console.log(`Final category order for ${menuType}:`, sorted);
  return sorted;
};
