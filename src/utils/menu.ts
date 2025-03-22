
import { MenuState } from "@/hooks/menuStateTypes";

// Format menu details for display or export
export const formatMenuDetails = (menuState: MenuState) => {
  console.log('Formatting menu details:', {
    isCustom: menuState.isCustomMenu,
    mainCourseType: menuState.mainCourseType,
    starterType: menuState.selectedStarterType,
    dessertType: menuState.dessertType
  });

  // For custom menus, just return the custom details
  if (menuState.isCustomMenu) {
    return {
      customMenu: true,
      details: menuState.customMenuDetails,
    };
  }

  // Format regular menu selections
  return {
    customMenu: false,
    starter: formatStarterDetails(menuState),
    mainCourse: formatMainCourseDetails(menuState),
    dessert: formatDessertDetails(menuState),
    notes: menuState.notes,
  };
};

const formatStarterDetails = (menuState: MenuState) => {
  switch (menuState.selectedStarterType) {
    case 'canapes':
      return {
        type: 'canapes',
        package: menuState.selectedCanapePackage,
        selections: menuState.selectedCanapes,
      };
    case 'plated':
      return {
        type: 'plated',
        selection: menuState.selectedPlatedStarter,
      };
    default:
      return { type: 'none' };
  }
};

const formatMainCourseDetails = (menuState: MenuState) => {
  switch (menuState.mainCourseType) {
    case 'buffet':
      return {
        type: 'buffet',
        meatSelections: menuState.buffetMeatSelections,
        vegetableSelections: menuState.buffetVegetableSelections,
        starchSelections: menuState.buffetStarchSelections,
        saladSelection: menuState.buffetSaladSelection,
      };
    case 'karoo':
      return {
        type: 'karoo',
        meatSelection: menuState.karooMeatSelection,
        starchSelection: menuState.karooStarchSelection,
        vegetableSelections: menuState.karooVegetableSelections,
        saladSelection: menuState.karooSaladSelection,
      };
    case 'plated':
      return {
        type: 'plated',
        mainSelection: menuState.platedMainSelection,
        saladSelection: menuState.platedSaladSelection,
      };
    default:
      return { type: 'none' };
  }
};

const formatDessertDetails = (menuState: MenuState) => {
  switch (menuState.dessertType) {
    case 'traditional':
      return {
        type: 'traditional',
        selection: menuState.traditionalDessert,
      };
    case 'canapes':
      return {
        type: 'canapes',
        selections: menuState.dessertCanapes,
      };
    case 'individual_cakes':
      return {
        type: 'individual_cakes',
        selections: menuState.individualCakes,
        quantities: menuState.individual_cake_quantities,
      };
    default:
      return { type: 'none' };
  }
};

// Helper functions to safely access array items
export const safeGetArray = <T>(arr: T[] | null | undefined, defaultValue: T[] = []): T[] => {
  if (!arr || !Array.isArray(arr)) {
    return defaultValue;
  }
  return arr;
};

// Helper function to ensure string values
export const safeGetString = (value: string | null | undefined, defaultValue: string = ''): string => {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  return value;
};
