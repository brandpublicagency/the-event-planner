import { useMemo } from 'react';
import { MenuItem } from '@/api/menuItemsApi';

export const useMenuCategories = (items: MenuItem[]) => {
  // Group items by category
  const categorizedItems = useMemo(() => {
    console.log("Grouping items by category:", items);
    const grouped: Record<string, MenuItem[]> = {};
    
    const uncategorizedItems = items.filter(item => !item.category);
    if (uncategorizedItems.length > 0) {
      grouped['Uncategorized'] = uncategorizedItems;
    }
    
    items.forEach(item => {
      if (item.category) {
        console.log(`Found item with category: ${item.label} - ${item.category}`);
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      }
    });
    
    console.log("Grouped items:", grouped);
    return grouped;
  }, [items]);

  // Detect if this is a buffet menu by checking the choice value
  const isBuffetMenu = useMemo(() => {
    if (!items.length) return false;
    const choiceValue = items[0]?.choice;
    return choiceValue === 'buffet-menu' || choiceValue === 'cho-buffet';
  }, [items]);

  // Define the buffet category order
  const buffetCategoryOrder = ['Meat', 'Vegetables', 'Starch', 'Salad'];

  // Get all categories with specific ordering for buffet menus
  const allCategories = useMemo(() => {
    const categories = Object.keys(categorizedItems);
    
    // For buffet menus, sort categories based on predefined order
    if (isBuffetMenu) {
      // Filter out buffet categories that exist in our data
      const buffetCategories = buffetCategoryOrder.filter(category => 
        categories.includes(category)
      );
      
      // Add any other categories that might not be in our predefined list
      const otherCategories = categories.filter(category => 
        !buffetCategoryOrder.includes(category) && category !== 'Uncategorized'
      ).sort();
      
      // Combine with 'Uncategorized' at the beginning if it exists
      if (categories.includes('Uncategorized')) {
        return ['Uncategorized', ...buffetCategories, ...otherCategories];
      }
      
      return [...buffetCategories, ...otherCategories];
    }
    
    // For non-buffet menus, keep the original logic
    if (categories.includes('Uncategorized')) {
      return ['Uncategorized', ...categories.filter(c => c !== 'Uncategorized').sort()];
    }
    
    console.log("All categories detected:", categories);
    return categories.sort();
  }, [categorizedItems, isBuffetMenu, buffetCategoryOrder]);

  return {
    categorizedItems,
    isBuffetMenu,
    allCategories,
    buffetCategoryOrder
  };
};
