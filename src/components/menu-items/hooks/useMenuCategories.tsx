
import { useMemo, useState, useCallback, useEffect } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { getCategoryOrder, storeCategoryOrder } from '@/api/menu/operations/reorderMenuItems';

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

  // Get the choiceId from the first item (if exists)
  const choiceId = useMemo(() => {
    if (!items.length) return '';
    return items[0]?.choice_id || '';
  }, [items]);

  // Detect if this is a buffet menu by checking the choice value
  const isBuffetMenu = useMemo(() => {
    if (!items.length) return false;
    const choiceValue = items[0]?.choice;
    return choiceValue === 'buffet-menu' || 
           choiceValue === 'cho-buffet' || 
           choiceValue === 'warm-karoo-feast' || 
           choiceValue === 'cho-feast';
  }, [items]);

  // Define the buffet category order
  const buffetCategoryOrder = ['Meat', 'Vegetables', 'Starch', 'Salad'];

  // Check if this is a section-main menu by checking the choice value
  const isSectionMain = useMemo(() => {
    if (!items.length) return false;
    const choiceValue = items[0]?.choice;
    return choiceValue === 'sec-mains' || 
           choiceValue?.includes('sec-main') || 
           choiceValue?.startsWith('sec-') || 
           choiceValue?.includes('-main');
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

  // State to track custom category ordering
  const [customCategoryOrder, setCustomCategoryOrder] = useState<string[]>([]);

  // Update custom category order
  const updateCategoryOrder = useCallback(async (newOrder: string[]) => {
    console.log("Updating custom category order:", newOrder);
    setCustomCategoryOrder(newOrder);
    
    // Persist the category order to the database
    if (choiceId) {
      const result = await storeCategoryOrder(choiceId, newOrder);
      console.log("Category order saved:", result);
    }
  }, [choiceId]);

  // Fetch saved category order when component mounts or choiceId changes
  useEffect(() => {
    const fetchCategoryOrder = async () => {
      if (!choiceId) return;
      
      try {
        const savedOrder = await getCategoryOrder(choiceId);
        if (savedOrder && savedOrder.length > 0) {
          console.log("Loaded saved category order:", savedOrder);
          setCustomCategoryOrder(savedOrder);
        }
      } catch (error) {
        console.error("Error fetching category order:", error);
      }
    };
    
    fetchCategoryOrder();
  }, [choiceId]);

  // Get all categories with specific ordering
  const allCategories = useMemo(() => {
    const categories = Object.keys(categorizedItems);
    
    // If we have a custom category order, use it as the primary source of truth
    if (customCategoryOrder.length > 0) {
      console.log("Using custom category order:", customCategoryOrder);
      
      // Filter the custom order to only include categories that exist in our data
      const existingCustomCategories = customCategoryOrder.filter(category => 
        categories.includes(category)
      );
      
      // Add any categories that might not be in our custom order (newly added categories)
      const missingCategories = categories.filter(category => 
        !customCategoryOrder.includes(category) && category !== 'Uncategorized'
      );
      
      // Combine with 'Uncategorized' at the beginning if it exists
      if (categories.includes('Uncategorized')) {
        return ['Uncategorized', ...existingCustomCategories, ...missingCategories];
      }
      
      return [...existingCustomCategories, ...missingCategories];
    }
    
    // For section-mains, buffet, or karoo menus, maintain the original order
    if (isSectionMain || isBuffetMenu) {
      console.log(`This is a ${isSectionMain ? 'section-main' : isBuffetMenu ? 'buffet/karoo menu' : 'other'}, maintaining original category order`);
      
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
    
    // For other menu types, keep the original logic
    if (categories.includes('Uncategorized')) {
      return ['Uncategorized', ...categories.filter(c => c !== 'Uncategorized').sort()];
    }
    
    console.log("All categories detected:", categories);
    return categories.sort();
  }, [categorizedItems, isBuffetMenu, isSectionMain, originalCategoryOrder, customCategoryOrder]);

  return {
    categorizedItems,
    isBuffetMenu,
    allCategories,
    buffetCategoryOrder,
    isSectionMain,
    originalCategoryOrder,
    updateCategoryOrder,
    customCategoryOrder
  };
};
