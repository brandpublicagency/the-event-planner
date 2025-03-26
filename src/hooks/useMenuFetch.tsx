
import { useState, useEffect, useCallback } from "react";
import { getMenuSelection } from "@/services/menuService";
import { MenuState, MenuSelectionResponse } from './menuStateTypes';
import { transformApiToMenuState } from "@/utils/menu/menuStateTransformers";
import { toast } from "sonner";

export const useMenuFetch = (eventCode: string) => {
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const fetchMenuSelections = useCallback(async (forceRefresh = false) => {
    if (!eventCode) {
      setError('Event code is required');
      setIsLoading(false);
      return;
    }

    // Prevent rapid consecutive fetches (within 2 seconds)
    const now = Date.now();
    if (!forceRefresh && (now - lastFetchTime < 2000)) {
      console.log('Skipping fetch - too soon after previous fetch');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setLastFetchTime(now);

      console.log(`Fetching menu selections for event: ${eventCode}`);
      const data = await getMenuSelection(eventCode);

      if (data) {
        console.log('Menu data loaded:', data);
        const menuData = data as unknown as MenuSelectionResponse;
        
        const transformedState = transformApiToMenuState(menuData);
        console.log('Transformed menu state:', {
          starter: transformedState.selectedStarterType,
          canapes: transformedState.selectedCanapes,
          mainCourse: transformedState.mainCourseType
        });
        
        setMenuState(transformedState);
        setLastSavedState(JSON.stringify(menuData));

        // Removed toast notification for menu data refresh
        // if (forceRefresh) {
        //   toast.success('Menu data refreshed');
        // }
      } else {
        console.log('No existing menu data found for this event. Using defaults.');
      }
      
      setIsInitialized(true);
    } catch (err: any) {
      console.error('Error fetching menu selections:', err);
      setError('Failed to load menu selections. Please try refreshing the page.');
      if (forceRefresh) {
        toast.error('Failed to refresh menu data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventCode, lastFetchTime]);

  // Initial data fetch
  useEffect(() => {
    fetchMenuSelections();
  }, [fetchMenuSelections]);

  return {
    menuState,
    setMenuState,
    error,
    isLoading,
    isInitialized,
    lastSavedState,
    setLastSavedState,
    refreshMenu: (force = true) => fetchMenuSelections(force),
  };
};
