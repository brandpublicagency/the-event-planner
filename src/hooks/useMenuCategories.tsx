
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { getCategoryOrder, storeCategoryOrder } from '@/api/menu/menuItemsApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Fixed category order by menu type - expanded and made more specific
const FIXED_CATEGORY_ORDER = {
  'buffet': ['Meat Selection (2)', 'Vegetables (2)', 'Starch (2)', 'Salad (1)'],
  'karoo': ['Meat Selection (1)', 'Vegetables (2)', 'Starch Selection (2)', 'Salad (1)'],
  'sec-mains': ['Meat Selection', 'Vegetables', 'Starch', 'Salad'], // Added explicit order for sec-mains
  'default': ['Meat Selection', 'Vegetables', 'Starch', 'Salad']
};

export const useMenuCategories = (items: MenuItem[]) => {
  const queryClient = useQueryClient();
  
  // Types that should use categorization (expanded to catch more variations)
  const CATEGORY_MENU_TYPES = [
    'sec-mains', 'sec_mains', 'secondary mains', 'secondary-mains',
    'secmains', 'secondary', 'mains', 'buffet', 'karoo'
  ];
  
  const useCategorization = useMemo(() => {
    if (items.length === 0) return false;
    
    // Check all items for any match with category menu types
    return items.some(item => {
      // Make sure to handle potential undefined or null choice values
      const choice = (item.choice || '').toLowerCase();
      // Check if any of our known category menu types matches
      return CATEGORY_MENU_TYPES.some(type => choice.includes(type));
    });
  }, [items]);

  // Get the choice ID for database operations
  const choiceId = useMemo(() => {
    if (items.length === 0) return null;
    return items[0].choice_id;
  }, [items]);

  // Determine the menu type based on the choice value
  const menuType = useMemo(() => {
    if (items.length === 0) return 'default';
    const choice = (items[0]?.choice || '').toLowerCase();
    
    if (choice.includes('karoo')) return 'karoo';
    if (choice.includes('buffet')) return 'buffet';
    if (choice.includes('sec-main') || choice.includes('sec_main') || 
        choice.includes('secondary main') || choice.includes('secondary-main') || 
        choice.includes('secmain') || choice.includes('secondary') || 
        choice.includes('main')) return 'sec-mains';
    return 'default';
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
      .filter(category => categorizedItems[category].length > 0);
    
    console.log("All detected categories:", categories);
    return categories;
  }, [categorizedItems, useCategorization]);

  // If there's a fixed order for this menu type, use it to sort the categories
  const sortedCategories = useMemo(() => {
    if (!menuType) return allCategories;
    
    // Get the fixed order for this menu type or use default
    const fixedOrder = FIXED_CATEGORY_ORDER[menuType as keyof typeof FIXED_CATEGORY_ORDER] || FIXED_CATEGORY_ORDER['default'];
    console.log(`Applying fixed category order for ${menuType}:`, fixedOrder);
    
    // Sort based on the fixed order, keeping any categories that aren't in the fixed order at the end
    const sorted = [...allCategories].sort((a, b) => {
      // Always put Uncategorized at the end
      if (a === 'Uncategorized') return 1;
      if (b === 'Uncategorized') return -1;
      
      // Special handling for categories that might have variations
      const aBaseCategory = getBaseCategory(a);
      const bBaseCategory = getBaseCategory(b);
      
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
  }, [allCategories, menuType]);

  // Helper function to get the base category name without numbers or brackets
  const getBaseCategory = (category: string): string => {
    // Remove any numbers, parentheses, and extra spaces
    return category.replace(/\s*\(\d+\)\s*$/, '').trim();
  };

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

  // Update customCategoryOrder when sortedCategories changes
  useEffect(() => {
    if (!useCategorization) {
      setCustomCategoryOrder(['Items']);
      return;
    }
    
    // ALWAYS use the sorted categories based on the fixed order
    console.log(`Using fixed category order for ${menuType}`);
    setCustomCategoryOrder(sortedCategories);
  }, [sortedCategories, useCategorization, menuType]);

  // Create a mutation for updating category order
  const reorderCategoryMutation = useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!choiceId) throw new Error("No choice ID available");
      console.log(`Saving category order for choice ${choiceId}:`, newOrder);
      return await storeCategoryOrder(choiceId, newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-choice-category-order', choiceId] });
      toast.success("Category order saved");
    },
    onError: (error) => {
      console.error("Failed to save category order:", error);
      toast.error("Failed to save category order");
    }
  });

  // Update category order and persist to database
  const updateCategoryOrder = async (newOrder: string[]) => {
    if (!useCategorization) return;
    
    // We now use fixed category orders for all menu types
    console.log(`Cannot reorder categories for ${menuType} - using fixed order`);
    toast.info("Categories are in a fixed order and cannot be changed");
    return;
  };

  return {
    categorizedItems,
    isBuffetMenu: useCategorization,
    allCategories,
    updateCategoryOrder,
    customCategoryOrder: sortedCategories,
    choiceId,
    isLoadingCategoryOrder
  };
};
