import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Check } from 'lucide-react';
import { calculatePrices } from './menuPriceCalculator';
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
    otherSelections: [],
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuSelections = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('menu_selections')
          .select('*')
          .eq('event_code', eventCode)
          .maybeSingle();

        if (error) throw error;

        if (data) {
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
            otherSelections: menuData.other_selections || [],
            notes: menuData.notes || '',
          });
        }
      } catch (err) {
        console.error('Error fetching menu selections:', err);
        setError('Failed to load menu selections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuSelections();
  }, [eventCode]);

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
      const prices = calculatePrices(menuState);
      
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
        other_selections: menuState.otherSelections,
        notes: menuState.notes,
        starter_price: prices.starterPrice,
        main_course_price: prices.mainCoursePrice,
        dessert_price: prices.dessertPrice,
        other_total_price: prices.otherTotalPrice
      };

      const { error } = await supabase
        .from('menu_selections')
        .upsert(menuData);

      if (error) throw error;

      toast({
        title: "Menu saved successfully",
        description: "Your menu selections have been updated",
        className: "bg-white border-green-500",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      console.error('Error saving menu selections:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save menu selections",
      });
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