
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { getCategoryOrder, storeCategoryOrder } from '@/api/menu/menuItemsApi';
import { useQuery } from '@tanstack/react-query';

export const useMenuCategories = (items: MenuItem[]) => {
  // Only sec-mains should have categorization
  const CATEGORY_MENU_TYPES = ['sec-mains'];
  
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
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
      });
  }, [categorizedItems, useCategorization]);

  // Fetch saved category order from database using React Query
  const { data: savedCategoryOrder = [] } = useQuery({
    queryKey: ['menu-choice-category-order', choiceId],
    queryFn: () => getCategoryOrder(choiceId || ''),
    enabled: !!choiceId && useCategorization,
    staleTime: 300000, // 5 minutes
  });

  // Custom category order state
  const [customCategoryOrder, setCustomCategoryOrder] = useState<string[]>([]);

  // Update customCategoryOrder when savedCategoryOrder changes
  useEffect(() => {
    if (savedCategoryOrder && savedCategoryOrder.length > 0) {
      console.log("Setting saved category order:", savedCategoryOrder);
      
      // Filter out any categories that no longer exist
      const validCategories = savedCategoryOrder.filter(cat => allCategories.includes(cat));
      
      // Add any missing categories that weren't in the saved order
      const missingCategories = allCategories.filter(cat => !savedCategoryOrder.includes(cat));
      
      const updatedOrder = [...validCategories, ...missingCategories];
      
      if (updatedOrder.length > 0) {
        console.log("Using saved category order:", updatedOrder);
        setCustomCategoryOrder(updatedOrder);
      }
    } else if (allCategories.length > 0 && customCategoryOrder.length === 0) {
      // Initialize with default order if no saved order exists
      setCustomCategoryOrder([...allCategories]);
    }
  }, [savedCategoryOrder, allCategories, customCategoryOrder.length]);

  // Update category order and persist to database
  const updateCategoryOrder = async (newOrder: string[]) => {
    console.log("Setting new category order:", newOrder);
    setCustomCategoryOrder(newOrder);
    
    // Save to database if we have a choiceId
    if (choiceId) {
      console.log(`Saving category order for choice ${choiceId}:`, newOrder);
      await storeCategoryOrder(choiceId, newOrder);
    }
  };

  // Determine the final category order to use
  const finalCategoryOrder = customCategoryOrder.length > 0 ? customCategoryOrder : allCategories;

  return {
    categorizedItems,
    isBuffetMenu: useCategorization, // Reuse the existing property name
    allCategories,
    updateCategoryOrder,
    customCategoryOrder: finalCategoryOrder,
    choiceId
  };
};
