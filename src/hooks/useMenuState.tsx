import { useState, useEffect, useCallback } from 'react';
import { getMenuSelection, updateMenuSelection } from "@/services/menuService";
import { MenuState, SaveMenuData, MenuSelectionResponse } from './menuStateTypes';
import { safeGetArray } from '@/utils/menu';
import { toast } from "sonner";

export const useMenuState = (eventCode: string) => {
  const [menuState, setMenuState] = useState<MenuState>({
    isCustomMenu: false,
    customMenuDetails: '',
    selectedStarterType: '',
    selectedCanapePackage: '',
    selectedCanapes: [],
    selectedPlatedStarter: '',
    mainCourseType: '',
    buffetMeatSelections: [],
    buffetVegetableSelections: [],
    buffetStarchSelections: [],
    buffetSaladSelection: '',
    karooMeatSelection: '',
    karooStarchSelection: [],
    karooVegetableSelections: [],
    karooSaladSelection: '',
    platedMainSelection: '',
    platedSaladSelection: '',
    dessertType: '',
    traditionalDessert: '',
    dessertCanapes: [],
    individualCakes: [],
    individual_cake_quantities: {},
    otherSelections: [],
    otherSelectionsQuantities: {},
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuSelections = async () => {
      if (!eventCode) {
        setError('Event code is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log(`Fetching menu selections for event: ${eventCode}`);
        const data = await getMenuSelection(eventCode);

        if (data) {
          console.log('Menu data loaded:', data);
          const menuData = data as unknown as MenuSelectionResponse;
          
          setMenuState({
            isCustomMenu: menuData.is_custom || false,
            customMenuDetails: menuData.custom_menu_details || '',
            selectedStarterType: menuData.starter_type || '',
            selectedCanapePackage: menuData.canape_package || '',
            selectedCanapes: safeGetArray(menuData.canape_selections),
            selectedPlatedStarter: menuData.plated_starter || '',
            mainCourseType: menuData.main_course_type || '',
            buffetMeatSelections: safeGetArray(menuData.buffet_meat_selections),
            buffetVegetableSelections: safeGetArray(menuData.buffet_vegetable_selections),
            buffetStarchSelections: safeGetArray(menuData.buffet_starch_selections),
            buffetSaladSelection: menuData.buffet_salad_selection || '',
            karooMeatSelection: menuData.karoo_meat_selection || '',
            karooStarchSelection: safeGetArray(menuData.karoo_starch_selection),
            karooVegetableSelections: safeGetArray(menuData.karoo_vegetable_selections),
            karooSaladSelection: menuData.karoo_salad_selection || '',
            platedMainSelection: menuData.plated_main_selection || '',
            platedSaladSelection: menuData.plated_salad_selection || '',
            dessertType: menuData.dessert_type || '',
            traditionalDessert: menuData.traditional_dessert || '',
            dessertCanapes: safeGetArray(menuData.dessert_canapes),
            individualCakes: safeGetArray(menuData.individual_cakes),
            individual_cake_quantities: menuData.individual_cake_quantities || {},
            otherSelections: safeGetArray(menuData.other_selections),
            otherSelectionsQuantities: menuData.other_selections_quantities || {},
            notes: menuData.notes || '',
          });
          
          setLastSavedState(JSON.stringify(menuData));
        } else {
          console.log('No existing menu data found for this event. Using defaults.');
        }
        
        setIsInitialized(true);
      } catch (err: any) {
        console.error('Error fetching menu selections:', err);
        setError('Failed to load menu selections. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuSelections();
  }, [eventCode]);

  const handleMenuStateChange = useCallback((field: keyof MenuState, value: any) => {
    console.log(`Updating menu state: ${String(field)}`, value);
    setMenuState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCustomMenuToggle = useCallback((checked: boolean) => {
    handleMenuStateChange('isCustomMenu', checked);
  }, [handleMenuStateChange]);

  const handleCanapeSelection = useCallback((position: number, value: string) => {
    setMenuState(prev => {
      const newCanapes = [...(prev.selectedCanapes || [])];
      newCanapes[position - 1] = value;
      return { ...prev, selectedCanapes: newCanapes };
    });
  }, []);

  const saveMenuSelections = useCallback(async (): Promise<void> => {
    if (!eventCode) {
      console.error('Cannot save: Event code is missing');
      throw new Error('Event code is required');
    }

    if (!isInitialized) {
      console.error('Cannot save: Menu state not fully initialized');
      throw new Error('Menu state not fully initialized');
    }

    try {
      console.log('Preparing menu data for saving...');
      setIsSaving(true);
      
      const menuData: SaveMenuData = {
        event_code: eventCode,
        is_custom: menuState.isCustomMenu,
        custom_menu_details: menuState.customMenuDetails,
        starter_type: menuState.selectedStarterType,
        canape_package: menuState.selectedCanapePackage,
        canape_selections: menuState.selectedCanapes || [],
        plated_starter: menuState.selectedPlatedStarter,
        main_course_type: menuState.mainCourseType,
        buffet_meat_selections: menuState.buffetMeatSelections || [],
        buffet_vegetable_selections: menuState.buffetVegetableSelections || [],
        buffet_starch_selections: menuState.buffetStarchSelections || [],
        buffet_salad_selection: menuState.buffetSaladSelection,
        karoo_meat_selection: menuState.karooMeatSelection,
        karoo_starch_selection: menuState.karooStarchSelection || [],
        karoo_vegetable_selections: menuState.karooVegetableSelections || [],
        karoo_salad_selection: menuState.karooSaladSelection,
        plated_main_selection: menuState.platedMainSelection,
        plated_salad_selection: menuState.platedSaladSelection,
        dessert_type: menuState.dessertType,
        traditional_dessert: menuState.traditionalDessert,
        dessert_canapes: menuState.dessertCanapes || [],
        individual_cakes: menuState.individualCakes || [],
        individual_cake_quantities: menuState.individual_cake_quantities || {},
        other_selections: menuState.otherSelections || [],
        other_selections_quantities: menuState.otherSelectionsQuantities || {},
        notes: menuState.notes,
      };

      console.log('Saving menu data with dessert info:', {
        dessertType: menuState.dessertType,
        traditionalDessert: menuState.traditionalDessert,
        menuData: menuData
      });
      
      const result = await updateMenuSelection(eventCode, menuData);
      
      setLastSavedState(JSON.stringify(menuData));
      
      console.log('Menu saved successfully', result);
      return Promise.resolve();
    } catch (err) {
      console.error('Error saving menu selections:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [eventCode, menuState, isInitialized]);

  const hasUnsavedChanges = useCallback(() => {
    if (!lastSavedState) return true;
    
    const currentStateString = JSON.stringify({
      event_code: eventCode,
      is_custom: menuState.isCustomMenu,
      custom_menu_details: menuState.customMenuDetails,
      starter_type: menuState.selectedStarterType,
      canape_package: menuState.selectedCanapePackage,
      canape_selections: menuState.selectedCanapes || [],
      plated_starter: menuState.selectedPlatedStarter,
      main_course_type: menuState.mainCourseType,
      buffet_meat_selections: menuState.buffetMeatSelections || [],
      buffet_vegetable_selections: menuState.buffetVegetableSelections || [],
      buffet_starch_selections: menuState.buffetStarchSelections || [],
      buffet_salad_selection: menuState.buffetSaladSelection,
      karoo_meat_selection: menuState.karooMeatSelection,
      karoo_starch_selection: menuState.karooStarchSelection || [],
      karoo_vegetable_selections: menuState.karooVegetableSelections || [],
      karoo_salad_selection: menuState.karooSaladSelection,
      plated_main_selection: menuState.platedMainSelection,
      plated_salad_selection: menuState.platedSaladSelection,
      dessert_type: menuState.dessertType,
      traditional_dessert: menuState.traditionalDessert,
      dessert_canapes: menuState.dessertCanapes || [],
      individual_cakes: menuState.individualCakes || [],
      individual_cake_quantities: menuState.individual_cake_quantities || {},
      other_selections: menuState.otherSelections || [],
      other_selections_quantities: menuState.otherSelectionsQuantities || {},
      notes: menuState.notes,
    });
    
    return currentStateString !== lastSavedState;
  }, [eventCode, lastSavedState, menuState]);

  return {
    menuState,
    error,
    isLoading,
    isSaving,
    isInitialized,
    hasUnsavedChanges,
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection,
    saveMenuSelections,
  };
};
