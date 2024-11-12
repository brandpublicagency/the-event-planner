import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useMenuState = (eventCode: string, toast: any) => {
  const [menuState, setMenuState] = useState({
    isCustomMenu: false,
    customMenuDetails: '',
    selectedStarterType: '',
    selectedCanapePackage: '',
    selectedCanapes: [] as string[],
    selectedPlatedStarter: '',
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

        if (error) {
          console.error('Error fetching menu selections:', error);
          setError('Failed to load menu selections');
          return;
        }

        if (data) {
          setMenuState({
            isCustomMenu: data.is_custom || false,
            customMenuDetails: data.custom_menu_details || '',
            selectedStarterType: data.starter_type || '',
            selectedCanapePackage: data.canape_package || '',
            selectedCanapes: data.canape_selections || [],
            selectedPlatedStarter: data.plated_starter || '',
            notes: data.notes || '',
          });
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuSelections();
  }, [eventCode]);

  const saveMenuSelections = async () => {
    try {
      const menuData = {
        event_code: eventCode,
        is_custom: menuState.isCustomMenu,
        custom_menu_details: menuState.customMenuDetails,
        starter_type: menuState.selectedStarterType,
        canape_package: menuState.selectedCanapePackage,
        canape_selections: menuState.selectedCanapes,
        plated_starter: menuState.selectedPlatedStarter,
        notes: menuState.notes,
      };

      const { error } = await supabase
        .from('menu_selections')
        .upsert(menuData);

      if (error) {
        console.error('Error saving menu selections:', error);
        toast({
          title: "Error",
          description: "Failed to save menu selections",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Menu selections saved successfully",
      });
    } catch (err) {
      console.error('Unexpected error saving menu selections:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    }
  };

  const handleCustomMenuToggle = async (checked: boolean) => {
    setMenuState(prev => ({
      ...prev,
      isCustomMenu: checked,
    }));
    await saveMenuSelections();
  };

  const handleCanapeSelection = async (position: number, value: string) => {
    setMenuState(prev => {
      const newCanapes = [...prev.selectedCanapes];
      newCanapes[position - 1] = value;
      return { ...prev, selectedCanapes: newCanapes };
    });
    await saveMenuSelections();
  };

  const handleMenuStateChange = async (field: string, value: any) => {
    setMenuState(prev => ({ ...prev, [field]: value }));
    await saveMenuSelections();
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