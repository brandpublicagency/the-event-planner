import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Check } from 'lucide-react';
import { starterTypes, mainCourseTypes, dessertTypes, otherOptions } from '@/components/menu/MenuTypes';
import { calculatePrices } from './menuPriceCalculator';
import { MenuState, SaveMenuData } from './menuStateTypes';

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
    karooStarchSelection: [], // Initialize as empty array
    karooVegetableSelections: [],
    karooSaladSelection: '',
    platedMainSelection: '',
    platedSaladSelection: '',
    dessertType: '',
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
          setMenuState({
            isCustomMenu: data.is_custom || false,
            customMenuDetails: data.custom_menu_details || '',
            selectedStarterType: data.starter_type || '',
            selectedCanapePackage: data.canape_package || '',
            selectedCanapes: data.canape_selections || [],
            selectedPlatedStarter: data.plated_starter || '',
            mainCourseType: data.main_course_type || '',
            buffetMeatSelections: data.buffet_meat_selections || [],
            buffetVegetableSelections: data.buffet_vegetable_selections || [],
            buffetStarchSelections: data.buffet_starch_selections || [],
            buffetSaladSelection: data.buffet_salad_selection || '',
            karooMeatSelection: data.karoo_meat_selection || '',
            karooStarchSelection: Array.isArray(data.karoo_starch_selection) ? data.karoo_starch_selection : [],
            karooVegetableSelections: data.karoo_vegetable_selections || [],
            karooSaladSelection: data.karoo_salad_selection || '',
            platedMainSelection: data.plated_main_selection || '',
            platedSaladSelection: data.plated_salad_selection || '',
            dessertType: data.dessert_type || '',
            otherSelections: data.other_selections || [],
            notes: data.notes || '',
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

  const handleMenuStateChange = (field: keyof MenuState, value: any) => {
    setMenuState(prev => ({ ...prev, [field]: value }));
  };

  return {
    menuState,
    error,
    isLoading,
    handleMenuStateChange,
    saveMenuSelections,
  };
};