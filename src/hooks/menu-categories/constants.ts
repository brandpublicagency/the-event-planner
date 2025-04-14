
// Fixed category orders for different menu types
export const FIXED_CATEGORY_ORDER = {
  'buffet': ['Meat Selection (2)', 'Vegetables (2)', 'Starch (2)', 'Salad (1)'],
  'karoo': ['Meat Selection (1)', 'Vegetables (2)', 'Starch Selection (2)', 'Salad (1)'],
  'sec-mains': ['Meat Selection', 'Vegetables', 'Starch', 'Salad'],
  'plated': ['Plated Main Course Selection (1)', 'Salad (1)'],
  'default': ['Meat Selection', 'Vegetables', 'Starch', 'Salad']
};

// Types that should use categorization
export const CATEGORY_MENU_TYPES = [
  'sec-mains', 'sec_mains', 'secondary mains', 'secondary-mains',
  'secmains', 'secondary', 'mains', 'buffet', 'karoo'
];

export interface CategoryState {
  categorizedItems: Record<string, any[]>;
  isBuffetMenu: boolean;
  allCategories: string[];
  updateCategoryOrder: (newOrder: string[]) => Promise<void>;
  customCategoryOrder: string[];
  choiceId: string | null;
  isLoadingCategoryOrder: boolean;
}
