import { useState, useEffect } from 'react';
import { getMenuSelection, updateMenuSelection } from "@/services/menuService";
import { MenuState, SaveMenuData, MenuSelectionResponse } from './menuStateTypes';

export const useMenuState = (eventCode: string, toast: any) => {
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
          
          const canapeSelections = Array.isArray(menuData.canape_selections) ? menuData.canape_selections : [];
          const buffetMeatSelections = Array.isArray(menuData.buffet_meat_selections) ? menuData.buffet_meat_selections : [];
          const buffetVegetableSelections = Array.isArray(menuData.buffet_vegetable_selections) ? menuData.buffet_vegetable_selections : [];
          const buffetStarchSelections = Array.isArray(menuData.buffet_starch_selections) ? menuData.buffet_starch_selections : [];
          const karooStarchSelection = Array.isArray(menuData.karoo_starch_selection) ? menuData.karoo_starch_selection : [];
          const karooVegetableSelections = Array.isArray(menuData.karoo_vegetable_selections) ? menuData.karoo_vegetable_selections : [];
          const dessertCanapes = Array.isArray(menuData.dessert_canapes) ? menuData.dessert_canapes : [];
          const individualCakes = Array.isArray(menuData.individual_cakes) ? menuData.individual_cakes : [];
          const otherSelections = Array.isArray(menuData.other_selections) ? menuData.other_selections : [];
          
          setMenuState({
            isCustomMenu: menuData.is_custom || false,
            customMenuDetails: menuData.custom_menu_details || '',
            selectedStarterType: menuData.starter_type || '',
            selectedCanapePackage: menuData.canape_package || '',
            selectedCanapes: canapeSelections,
            selectedPlatedStarter: menuData.plated_starter || '',
            mainCourseType: menuData.main_course_type || '',
            buffetMeatSelections,
            buffetVegetableSelections,
            buffetStarchSelections,
            buffetSaladSelection: menuData.buffet_salad_selection || '',
            karooMeatSelection: menuData.karoo_meat_selection || '',
            karooStarchSelection,
            karooVegetableSelections,
            karooSaladSelection: menuData.karoo_salad_selection || '',
            platedMainSelection: menuData.plated_main_selection || '',
            platedSaladSelection: menuData.plated_salad_selection || '',
            dessertType: menuData.dessert_type || '',
            traditionalDessert: menuData.traditional_dessert || '',
            dessertCanapes,
            individualCakes,
            individual_cake_quantities: menuData.individual_cake_quantities || {},
            otherSelections,
            otherSelectionsQuantities: menuData.other_selections_quantities || {},
            notes: menuData.notes || '',
          });
          console.log('Menu state initialized:', menuState);
        } else {
          console.log('No existing menu data found for this event. Using defaults.');
        }
      } catch (err: any) {
        console.error('Error fetching menu selections:', err);
        setError('Failed to load menu selections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuSelections();
  }, [eventCode]);

  const handleMenuStateChange = (field: keyof MenuState, value: any) => {
    console.log(`Updating menu state: ${field} = `, value);
    setMenuState(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomMenuToggle = (checked: boolean) => {
    handleMenuStateChange('isCustomMenu', checked);
  };

  const handleCanapeSelection = (position: number, value: string) => {
    const newCanapes = [...menuState.selectedCanapes];
    newCanapes[position - 1] = value;
    handleMenuStateChange('selectedCanapes', newCanapes);
  };

  const saveMenuSelections = async () => {
    if (!eventCode) {
      console.error('Cannot save: Event code is missing');
      throw new Error('Event code is required');
    }

    try {
      console.log('Preparing menu data for saving...');
      
      const menuData: SaveMenuData = {
        event_code: eventCode,
        is_custom: menuState.isCustomMenu,
        custom_menu_details: menuState.customMenuDetails,
        starter_type: menuState.selectedStarterType,
        canape_package: menuState.selectedCanapePackage,
        canape_selections: menuState.selectedCanapes,
        plated_starter: menuState.selectedPlatedStarter,
        main_course_type: menuState.mainCourseType,
        buffet_meat_selections: menuState.buffetMeatSelections,
        buffet_vegetable_selections: menuState.buffetVegetableSelections,
        buffet_starch_selections: menuState.buffetStarchSelections,
        buffet_salad_selection: menuState.buffetSaladSelection,
        karoo_meat_selection: menuState.karooMeatSelection,
        karoo_starch_selection: menuState.karooStarchSelection,
        karoo_vegetable_selections: menuState.karooVegetableSelections,
        karoo_salad_selection: menuState.karooSaladSelection,
        plated_main_selection: menuState.platedMainSelection,
        plated_salad_selection: menuState.platedSaladSelection,
        dessert_type: menuState.dessertType,
        traditional_dessert: menuState.traditionalDessert,
        dessert_canapes: menuState.dessertCanapes,
        individual_cakes: menuState.individualCakes,
        individual_cake_quantities: menuState.individual_cake_quantities,
        other_selections: menuState.otherSelections,
        other_selections_quantities: menuState.otherSelectionsQuantities,
        notes: menuState.notes,
      };

      console.log('Saving menu data:', menuData);
      const result = await updateMenuSelection(eventCode, menuData);
      console.log('Menu saved successfully:', result);
      
      return result;
    } catch (err) {
      console.error('Error saving menu selections:', err);
      throw err;
    }
  };

  return {
    menuState,
    error,
    isLoading,
    handleMenuStateChange,
    handleCustomMenuToggle,
    handleCanapeSelection,
    saveMenuSelections,
  };
};
