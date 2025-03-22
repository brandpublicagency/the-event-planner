
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Check } from 'lucide-react';
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
  const [fetchAttempts, setFetchAttempts] = useState(0);

  const fetchMenuSelections = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching menu selections for event ${eventCode}, attempt ${fetchAttempts + 1}`);

      const { data, error } = await supabase
        .from('menu_selections')
        .select('*')
        .eq('event_code', eventCode)
        .maybeSingle();

      if (error) {
        console.error("Supabase error fetching menu selections:", error);
        throw error;
      }

      if (data) {
        console.log("Menu data found:", data);
        const menuData = data as unknown as MenuSelectionResponse;
        setMenuState({
          isCustomMenu: menuData.is_custom || false,
          customMenuDetails: menuData.custom_menu_details || '',
          selectedStarterType: menuData.starter_type || '',
          selectedCanapePackage: menuData.canape_package || '',
          selectedCanapes: menuData.canape_selections || [],
          selectedPlatedStarter: menuData.plated_starter || '',
          mainCourseType: menuData.main_course_type || '',
          buffetMeatSelections: menuData.buffet_meat_selections || [],
          buffetVegetableSelections: menuData.buffet_vegetable_selections || [],
          buffetStarchSelections: menuData.buffet_starch_selections || [],
          buffetSaladSelection: menuData.buffet_salad_selection || '',
          karooMeatSelection: menuData.karoo_meat_selection || '',
          karooStarchSelection: Array.isArray(menuData.karoo_starch_selection) ? menuData.karoo_starch_selection : [],
          karooVegetableSelections: menuData.karoo_vegetable_selections || [],
          karooSaladSelection: menuData.karoo_salad_selection || '',
          platedMainSelection: menuData.plated_main_selection || '',
          platedSaladSelection: menuData.plated_salad_selection || '',
          dessertType: menuData.dessert_type || '',
          traditionalDessert: menuData.traditional_dessert || '',
          dessertCanapes: Array.isArray(menuData.dessert_canapes) ? menuData.dessert_canapes : [],
          individualCakes: Array.isArray(menuData.individual_cakes) ? menuData.individual_cakes : [],
          individual_cake_quantities: menuData.individual_cake_quantities || {},
          otherSelections: menuData.other_selections || [],
          otherSelectionsQuantities: menuData.other_selections_quantities || {},
          notes: menuData.notes || '',
        });
      } else {
        console.log("No menu data found for event", eventCode);
      }
    } catch (err) {
      console.error('Error fetching menu selections:', err);
      setError('Failed to load menu selections');
      
      // Retry once if we haven't already
      if (fetchAttempts < 1) {
        setFetchAttempts(prev => prev + 1);
        setTimeout(() => fetchMenuSelections(), 1500);
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventCode, fetchAttempts]);

  useEffect(() => {
    if (eventCode) {
      fetchMenuSelections();
    }
  }, [eventCode, fetchMenuSelections]);

  const handleMenuStateChange = (field: keyof MenuState, value: any) => {
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
    try {
      console.log('Preparing to save menu selections for event:', eventCode);
      
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

      const { error: saveError } = await supabase
        .from('menu_selections')
        .upsert(menuData);

      if (saveError) {
        console.error('Error from Supabase when saving menu:', saveError);
        throw saveError;
      }

      toast({
        title: "Menu saved successfully",
        description: "Your menu selections have been updated",
        variant: "success",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error saving menu selections:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu selections: " + (err.message || "Unknown error"),
      });
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
