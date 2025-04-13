
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';

// List of menu types that should NOT use categories
const NO_CATEGORY_TYPES = [
  'plated-starter', 
  'plated-main', 
  'plated-menu'
];

export const useMenuCategories = (items: MenuItem[]) => {
  // Check if this is a buffet or similar menu type that requires categorization
  const isBuffetMenu = useMemo(() => {
    if (items.length === 0) return false;
    
    const firstItem = items[0];
    const choice = firstItem.choice;
    
    // Include buffet, main courses, and feast types
    return [
      'buffet-menu', 
      'cho-buffet', 
      'warm-karoo-feast', 
      'cho-feast', 
      'sec-mains', 
      'sec-main',
      'sec-main-vegetarian',
      'sec-main-vegan'
    ].includes(choice);
  }, [items]);

  // Determine if categories should be used
  const useCategorization = useMemo(() => {
    if (items.length === 0) return false;
    
    const firstItem = items[0];
    const choice = firstItem.choice;
    
    // Return false for plated menu types
    return !NO_CATEGORY_TYPES.includes(choice);
  }, [items]);

  // Categorize items
  const categorizedItems = useMemo(() => {
    if (!useCategorization) {
      // If categories are not used, return all items under a single category
      return { 'Items': items };
    }

    // Group items by category, handling null/undefined categories
    return items.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
  }, [items, useCategorization]);

  // Get all unique categories
  const allCategories = useMemo(() => {
    if (!useCategorization) return ['Items'];
    
    return Object.keys(categorizedItems)
      .filter(category => categorizedItems[category].length > 0)
      .sort((a, b) => {
        // Prioritize 'Uncategorized' to be last
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
      });
  }, [categorizedItems]);

  // Custom category order (if needed)
  const [customCategoryOrder, setCustomCategoryOrder] = useState<string[]>([]);

  // Update category order
  const updateCategoryOrder = (newOrder: string[]) => {
    setCustomCategoryOrder(newOrder);
  };

  return {
    categorizedItems,
    isBuffetMenu,
    allCategories,
    updateCategoryOrder,
    customCategoryOrder
  };
};
