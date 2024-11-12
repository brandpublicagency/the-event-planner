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
      if (!eventCode) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('menu_selections')
          .select('*')
          .eq('event_code', eventCode)
          .single();

        if (error) {
          console.error('Error fetching menu selections:', error);
          toast({
            title: "Error loading menu selections",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          setError(error.message);
          return;
        }

        if (data) {
          setMenuState({
            isCustomMenu: data.is_custom || false,
            customMenuDetails: data.custom_menu_details || '',
            selectedStarterType: !data.is_custom ? data.starter_type || '' : '',
            selectedCanapePackage: !data.is_custom ? data.canape_package || '' : '',
            selectedCanapes: !data.is_custom ? data.canape_selections || [] : [],
            selectedPlatedStarter: !data.is_custom ? data.plated_starter || '' : '',
            notes: data.notes || '',
          });
          setError(null);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({
          title: "Error loading menu selections",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        setError('An unexpected error occurred while loading menu selections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuSelections();
  }, [eventCode, toast]);

  const saveMenuSelections = async () => {
    if (!eventCode) return;

    try {
      const menuData = {
        event_code: eventCode,
        is_custom: menuState.isCustomMenu,
        custom_menu_details: menuState.isCustomMenu ? menuState.customMenuDetails : null,
        starter_type: !menuState.isCustomMenu ? menuState.selectedStarterType : null,
        canape_package: !menuState.isCustomMenu ? menuState.selectedCanapePackage : null,
        canape_selections: !menuState.isCustomMenu ? menuState.selectedCanapes : null,
        plated_starter: !menuState.isCustomMenu ? menuState.selectedPlatedStarter : null,
        notes: menuState.notes,
      };

      const { error } = await supabase
        .from('menu_selections')
        .upsert(menuData);

      if (error) {
        console.error('Error saving menu selections:', error);
        toast({
          title: "Error saving menu selections",
          description: error.message,
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
        title: "Error saving menu selections",
        description: "An unexpected error occurred while saving",
        variant: "destructive",
      });
    }
  };

  const handleCustomMenuToggle = (checked: boolean) => {
    setMenuState(prev => ({
      ...prev,
      isCustomMenu: checked,
      selectedStarterType: checked ? '' : prev.selectedStarterType,
      selectedCanapePackage: checked ? '' : prev.selectedCanapePackage,
      selectedCanapes: checked ? [] : prev.selectedCanapes,
      selectedPlatedStarter: checked ? '' : prev.selectedPlatedStarter,
      customMenuDetails: checked ? prev.customMenuDetails : '',
    }));
    saveMenuSelections();
  };

  const handleCanapeSelection = (position: number, value: string) => {
    setMenuState(prev => {
      const newCanapes = [...prev.selectedCanapes];
      newCanapes[position - 1] = value;
      return { ...prev, selectedCanapes: newCanapes };
    });
    saveMenuSelections();
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