import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Check } from 'lucide-react';
import { starterTypes, mainCourseTypes, dessertTypes, otherOptions } from '@/components/menu/MenuTypes';

export const useMenuState = (eventCode: string, toast: any) => {
  const [menuState, setMenuState] = useState({
    isCustomMenu: false,
    customMenuDetails: '',
    selectedStarterType: '',
    selectedCanapePackage: '',
    selectedCanapes: [] as string[],
    selectedPlatedStarter: '',
    mainCourseType: '',
    dessertType: '',
    otherSelections: [] as string[],
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

  const calculatePrices = () => {
    let starterPrice = 0;
    let mainCoursePrice = 0;
    let dessertPrice = 0;
    let otherTotalPrice = 0;

    // Calculate starter price
    if (menuState.selectedStarterType) {
      const starter = starterTypes.find(s => s.value === menuState.selectedStarterType);
      if (starter) {
        starterPrice = starter.price;
      }
    }

    // Calculate main course price
    if (menuState.mainCourseType) {
      const mainCourse = mainCourseTypes.find(m => m.value === menuState.mainCourseType);
      if (mainCourse) {
        mainCoursePrice = mainCourse.price;
      }
    }

    // Calculate dessert price
    if (menuState.dessertType) {
      const dessert = dessertTypes.find(d => d.value === menuState.dessertType);
      if (dessert) {
        dessertPrice = dessert.price;
      }
    }

    // Calculate other options total
    menuState.otherSelections.forEach(selection => {
      const option = otherOptions.find(o => o.value === selection);
      if (option) {
        otherTotalPrice += option.price;
      }
    });

    return {
      starterPrice,
      mainCoursePrice,
      dessertPrice,
      otherTotalPrice
    };
  };

  const saveMenuSelections = async () => {
    try {
      const prices = calculatePrices();
      
      const menuData = {
        event_code: eventCode,
        is_custom: menuState.isCustomMenu,
        custom_menu_details: menuState.customMenuDetails,
        starter_type: menuState.selectedStarterType,
        canape_package: menuState.selectedCanapePackage,
        canape_selections: menuState.selectedCanapes,
        plated_starter: menuState.selectedPlatedStarter,
        main_course_type: menuState.mainCourseType,
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

  const handleCustomMenuToggle = (checked: boolean) => {
    setMenuState(prev => ({
      ...prev,
      isCustomMenu: checked,
    }));
  };

  const handleCanapeSelection = (position: number, value: string) => {
    setMenuState(prev => {
      const newCanapes = [...prev.selectedCanapes];
      newCanapes[position - 1] = value;
      return { ...prev, selectedCanapes: newCanapes };
    });
  };

  const handleMenuStateChange = (field: string, value: any) => {
    setMenuState(prev => ({ ...prev, [field]: value }));
  };

  return {
    menuState,
    error,
    isLoading,
    handleCustomMenuToggle,
    handleCanapeSelection,
    handleMenuStateChange,
    saveMenuSelections,
  };
};