
import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '@/api/types/menuItems';
import { toast } from 'sonner';
import { 
  shouldUseCategorization, 
  determineMenuType, 
  getChoiceId, 
  categorizeItems, 
  getAllCategories, 
  sortCategories 
} from './utils';
import { useCategoryOperations } from './useCategoryOperations';
import { CategoryState } from './constants';

export const useMenuCategories = (items: MenuItem[]): CategoryState => {
  // Determine if categorization should be used
  const useCategorization = useMemo(() => shouldUseCategorization(items), [items]);
  
  // Get the choice ID for database operations
  const choiceId = useMemo(() => getChoiceId(items), [items]);
  
  // Determine the menu type based on the choice value
  const menuType = useMemo(() => determineMenuType(items), [items]);
  
  // Categorize items
  const categorizedItems = useMemo(() => 
    categorizeItems(items, useCategorization), 
    [items, useCategorization]
  );
  
  // Get all unique categories
  const allCategories = useMemo(() => 
    getAllCategories(categorizedItems, useCategorization), 
    [categorizedItems, useCategorization]
  );
  
  // Sort categories based on menu type
  const sortedCategories = useMemo(() => 
    sortCategories(allCategories, menuType), 
    [allCategories, menuType]
  );
  
  // Fetch saved category order and create mutation
  const { 
    savedCategoryOrder, 
    isLoadingCategoryOrder, 
    reorderCategoryMutation 
  } = useCategoryOperations(choiceId, useCategorization);
  
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
