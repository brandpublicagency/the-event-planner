
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { getCategoryOrder, storeCategoryOrder } from '@/api/menu/menuItemsApi';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useMenuCategories = (items: MenuItem[]) => {
  // Types that should use categorization (sec-mains and other possible variants)
  const CATEGORY_MENU_TYPES = ['sec-mains', 'sec_mains', 'secondary mains', 'secondary-mains'];
  
  const useCategorization = useMemo(() => {
    if (items.length === 0) return false;
    
    const firstItem = items[0];
    // Make sure to handle potential undefined or null choice values
    const choice = firstItem.choice?.trim?.()?.toLowerCase?.() || '';
    
    console.log(`useMenuCategories: Choice value for first item: "${choice}"`);
    
    // Check if any of our known category menu types matches
    return CATEGORY_MENU_TYPES.some(type => 
      choice === type || choice.includes(type));
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
    
    const categories = Object.keys(categorizedItems)
      .filter(category => categorizedItems[category].length > 0)
      .sort((a, b) => {
        // Always put Uncategorized at the end
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        // Otherwise, sort alphabetically
        return a.localeCompare(b);
      });
    
    console.log("All detected categories:", categories);
    return categories;
  }, [categorizedItems, useCategorization]);

  // Fetch saved category order from database using React Query
  const { data: savedCategoryOrder = [], isLoading: isLoadingCategoryOrder } = useQuery({
    queryKey: ['menu-choice-category-order', choiceId],
    queryFn: async () => {
      if (!choiceId || !useCategorization) return [];
      console.log("Fetching saved category order for choice:", choiceId);
      try {
        const order = await getCategoryOrder(choiceId);
        console.log("Received saved category order:", order);
        return order;
      } catch (error) {
        console.error("Error fetching category order:", error);
        toast.error("Failed to load category order");
        return [];
      }
    },
    enabled: !!choiceId && useCategorization,
    staleTime: 300000, // 5 minutes
  });

  // Custom category order state
  const [customCategoryOrder, setCustomCategoryOrder] = useState<string[]>([]);

  // Update customCategoryOrder when savedCategoryOrder or allCategories changes
  useEffect(() => {
    if (!useCategorization) {
      setCustomCategoryOrder(['Items']);
      return;
    }
    
    console.log("Updating category order with saved:", savedCategoryOrder);
    console.log("All categories available:", allCategories);
    
    if (savedCategoryOrder && savedCategoryOrder.length > 0) {
      // Filter out any categories that no longer exist
      const validSavedCategories = savedCategoryOrder.filter(cat => 
        allCategories.includes(cat)
      );
      
      // Find categories that exist but aren't in the saved order
      const missingCategories = allCategories.filter(cat => 
        !savedCategoryOrder.includes(cat)
      );
      
      // Combine valid saved categories with any new ones
      if (validSavedCategories.length > 0 || missingCategories.length > 0) {
        const combinedOrder = [...validSavedCategories, ...missingCategories];
        console.log("Using combined category order:", combinedOrder);
        setCustomCategoryOrder(combinedOrder);
      }
    } else {
      // If no saved order exists, use the detected categories
      console.log("No saved order, using detected categories:", allCategories);
      setCustomCategoryOrder([...allCategories]);
    }
  }, [savedCategoryOrder, allCategories, useCategorization]);

  // Update category order and persist to database
  const updateCategoryOrder = async (newOrder: string[]) => {
    if (!useCategorization) return;
    
    console.log("Setting new category order:", newOrder);
    setCustomCategoryOrder(newOrder);
    
    // Save to database if we have a choiceId
    if (choiceId) {
      try {
        console.log(`Saving category order for choice ${choiceId}:`, newOrder);
        await storeCategoryOrder(choiceId, newOrder);
        toast.success("Category order saved");
      } catch (error) {
        console.error("Failed to save category order:", error);
        toast.error("Failed to save category order");
      }
    }
  };

  return {
    categorizedItems,
    isBuffetMenu: useCategorization,
    allCategories,
    updateCategoryOrder,
    customCategoryOrder: customCategoryOrder.length > 0 ? customCategoryOrder : allCategories,
    choiceId,
    isLoadingCategoryOrder
  };
};
