import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Check } from 'lucide-react';

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
          variant: "destructive",
          title: "Error saving menu",
          description: "Failed to save menu selections. Please try again.",
        });
        return;
      }

      toast({
        title: "Menu saved successfully",
        description: "Your menu selections have been updated",
        className: "bg-white border-green-500",
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
    } catch (err) {
      console.error('Unexpected error saving menu selections:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while saving",
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