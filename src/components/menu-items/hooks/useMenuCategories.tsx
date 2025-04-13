
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

  // Check if this is a section-main menu by checking the choice value
  const isSectionMain = useMemo(() => {
    if (!items.length) return false;
    const choiceValue = items[0]?.choice;
    return choiceValue === 'sec-mains' || choiceValue?.includes('sec-main');
  }, [items]);

  // Get the original order of categories as they appear in the items array
  const originalCategoryOrder = useMemo(() => {
    if (!items.length) return [];
    
    const seenCategories = new Set<string>();
    const orderedCategories: string[] = [];
    
    // Add categories in the order they first appear in the items array
    items.forEach(item => {
      if (item.category && !seenCategories.has(item.category)) {
        seenCategories.add(item.category);
        orderedCategories.push(item.category);
      }
    });
    
    return orderedCategories;
  }, [items]);

  // Get all categories with specific ordering for buffet menus
  const allCategories = useMemo(() => {
    const categories = Object.keys(categorizedItems);
    
    // For section-mains, maintain the original order
    if (isSectionMain) {
      console.log("This is a section-main, maintaining original category order");
      
      // Filter the original categories to only include those that exist in our data
      const existingOriginalCategories = originalCategoryOrder.filter(category => 
        categories.includes(category)
      );
      
      // Add any categories that might not be in our original list (should be rare)
      const missingCategories = categories.filter(category => 
        !originalCategoryOrder.includes(category) && category !== 'Uncategorized'
      );
      
      // Combine with 'Uncategorized' at the beginning if it exists
      if (categories.includes('Uncategorized')) {
        return ['Uncategorized', ...existingOriginalCategories, ...missingCategories];
      }
      
      return [...existingOriginalCategories, ...missingCategories];
    }
    
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
  }, [categorizedItems, isBuffetMenu, isSectionMain, buffetCategoryOrder, originalCategoryOrder]);

  return {
    categorizedItems,
    isBuffetMenu,
    allCategories,
    buffetCategoryOrder,
    isSectionMain,
    originalCategoryOrder
  };
};
