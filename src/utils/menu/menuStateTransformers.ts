
import { MenuSelectionResponse, MenuState } from "@/hooks/menuStateTypes";
import { safeGetArray } from "@/utils/menu";

/**
 * Transforms the API response data into the internal MenuState format
 */
export const transformApiToMenuState = (
  data: MenuSelectionResponse
): MenuState => {
  console.log('Transforming API data to menu state:', {
    isCustom: data.is_custom,
    starterType: data.starter_type,
    canapePackage: data.canape_package,
    canapeSelections: data.canape_selections
  });

  return {
    isCustomMenu: data.is_custom || false,
    customMenuDetails: data.custom_menu_details || '',
    selectedStarterType: data.starter_type || '',
    selectedCanapePackage: data.canape_package || '',
    selectedCanapes: safeGetArray(data.canape_selections),
    selectedPlatedStarter: data.plated_starter || '',
    mainCourseType: data.main_course_type || '',
    buffetMeatSelections: safeGetArray(data.buffet_meat_selections),
    buffetVegetableSelections: safeGetArray(data.buffet_vegetable_selections),
    buffetStarchSelections: safeGetArray(data.buffet_starch_selections),
    buffetSaladSelection: data.buffet_salad_selection || '',
    karooMeatSelection: data.karoo_meat_selection || '',
    karooStarchSelection: safeGetArray(data.karoo_starch_selection),
    karooVegetableSelections: safeGetArray(data.karoo_vegetable_selections),
    karooSaladSelection: data.karoo_salad_selection || '',
    platedMainSelection: data.plated_main_selection || '',
    platedSaladSelection: data.plated_salad_selection || '',
    dessertType: data.dessert_type || '',
    traditionalDessert: data.traditional_dessert || '',
    dessertCanapes: safeGetArray(data.dessert_canapes),
    individualCakes: safeGetArray(data.individual_cakes),
    individual_cake_quantities: data.individual_cake_quantities || {},
    otherSelections: safeGetArray(data.other_selections),
    otherSelectionsQuantities: data.other_selections_quantities || {},
    notes: data.notes || '',
  };
};

/**
 * Transforms the internal MenuState to the format expected by the API for saving
 */
export const transformMenuStateToApi = (
  eventCode: string,
  menuState: MenuState
) => {
  console.log('Transforming menu state to API format:', {
    eventCode,
    isCustom: menuState.isCustomMenu,
    canapesCount: menuState.selectedCanapes?.length || 0
  });

  // Ensure all arrays are filtered to remove empty strings
  const safeArray = (arr: string[] | undefined | null): string[] => {
    if (!arr) return [];
    return arr.filter(item => item && item.trim() !== '');
  };

  // Make sure to handle all array properties properly
  const apiData = {
    event_code: eventCode,
    is_custom: menuState.isCustomMenu,
    custom_menu_details: menuState.customMenuDetails,
    starter_type: menuState.selectedStarterType,
    canape_package: menuState.selectedCanapePackage,
    canape_selections: safeArray(menuState.selectedCanapes),
    plated_starter: menuState.selectedPlatedStarter,
    main_course_type: menuState.mainCourseType,
    buffet_meat_selections: safeArray(menuState.buffetMeatSelections),
    buffet_vegetable_selections: safeArray(menuState.buffetVegetableSelections),
    buffet_starch_selections: safeArray(menuState.buffetStarchSelections),
    buffet_salad_selection: menuState.buffetSaladSelection,
    karoo_meat_selection: menuState.karooMeatSelection,
    karoo_starch_selection: safeArray(menuState.karooStarchSelection),
    karoo_vegetable_selections: safeArray(menuState.karooVegetableSelections),
    karoo_salad_selection: menuState.karooSaladSelection,
    plated_main_selection: menuState.platedMainSelection,
    plated_salad_selection: menuState.platedSaladSelection,
    dessert_type: menuState.dessertType,
    traditional_dessert: menuState.traditionalDessert,
    dessert_canapes: safeArray(menuState.dessertCanapes),
    individual_cakes: safeArray(menuState.individualCakes),
    individual_cake_quantities: menuState.individual_cake_quantities || {},
    other_selections: safeArray(menuState.otherSelections),
    other_selections_quantities: menuState.otherSelectionsQuantities || {},
    notes: menuState.notes,
  };

  console.log('Final API data for saving:', {
    event_code: apiData.event_code,
    canape_selections: apiData.canape_selections,
    canape_package: apiData.canape_package
  });

  return apiData;
};
