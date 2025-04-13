
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { getCategoryOrder } from '@/api/menu/menuItemsApi';

export const useMenuCategories = (items: MenuItem[]) => {
  // Menu types that should use categories
  const CATEGORY_MENU_TYPES = ['sec-mains', 'buffet-menu', 'cho-buffet', 'warm-karoo-feast', 'cho-feast', 'plated-menu'];
  
  // Check if this is a menu type that should use categories
  const isMainCourseMenu = useMemo(() => {
    if (items.length === 0) return false;
    
    const firstItem = items[0];
    const choice = firstItem.choice;
    
    return CATEGORY_MENU_TYPES.includes(choice);
  }, [items]);

  // Determine if categories should be used
  const useCategorization = useMemo(() => {
    if (items.length === 0) return false;
    
    const firstItem = items[0];
    const choice = firstItem.choice;
    
    return CATEGORY_MENU_TYPES.includes(choice);
  }, [items]);

  // Get the choice ID for database operations
  const choiceId = useMemo(() => {
    if (items.length === 0) return null;
    return items[0].choice_id;
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
  }, [categorizedItems, useCategorization]);

  // Custom category order
  const [customCategoryOrder, setCustomCategoryOrder] = useState<string[]>([]);

  // Update category order
  const updateCategoryOrder = (newOrder: string[]) => {
    console.log("Setting new category order:", newOrder);
    setCustomCategoryOrder(newOrder);
  };

  // Fetch saved category order from database
  useEffect(() => {
    if (choiceId && useCategorization) {
      console.log(`Fetching saved category order for choice: ${choiceId}`);
      getCategoryOrder(choiceId)
        .then(savedOrder => {
          if (savedOrder && savedOrder.length > 0) {
            console.log("Found saved category order:", savedOrder);
            
            // Filter out any categories that no longer exist
            const validCategories = savedOrder.filter(cat => allCategories.includes(cat));
            
            // Add any missing categories that weren't in the saved order
            const missingCategories = allCategories.filter(cat => !savedOrder.includes(cat));
            
            const updatedOrder = [...validCategories, ...missingCategories];
            
            if (updatedOrder.length > 0) {
              console.log("Using saved category order:", updatedOrder);
              setCustomCategoryOrder(updatedOrder);
            }
          }
        })
        .catch(error => {
          console.error("Error fetching category order:", error);
        });
    }
  }, [choiceId, useCategorization, allCategories]);

  return {
    categorizedItems,
    isBuffetMenu: isMainCourseMenu, // Reuse the existing property name to avoid breaking changes
    allCategories,
    updateCategoryOrder,
    customCategoryOrder,
    choiceId
  };
};
