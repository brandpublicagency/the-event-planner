
import React, { useEffect, useState, useRef } from 'react';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import MenuContent from './menu/MenuContent';
import NotesSection from './menu/NotesSection';
import { useMenuState } from '../hooks/useMenuState';
import { MenuState } from '../hooks/menuStateTypes';

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (checked: boolean) => void;
  onMenuStateChange?: (menuState: MenuState) => void;
  saveMenuSelections?: (saveFn: () => Promise<void>) => void;
}

const WeddingMenuPlanner = ({ 
  eventCode, 
  eventName, 
  isCustomMenu, 
  onCustomMenuToggle,
  onMenuStateChange,
  saveMenuSelections
}: WeddingMenuPlannerProps) => {
  
  const { 
    menuState, 
    error,
    isLoading,
    isSaving,
    handleMenuStateChange,
    handleCanapeSelection,
    saveMenuSelections: saveMenu
  } = useMenuState(eventCode);
  
  // Flag to prevent feedback loop
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const initialLoadComplete = useRef(false);
  const saveRegistered = useRef(false);

  // Simulate progress when loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + (100 - prev) * 0.1;
          return Math.min(newProgress, 95); // Cap at 95% until actual completion
        });
      }, 300);
      
      return () => {
        clearInterval(interval);
        if (!isLoading) {
          setLoadingProgress(100);
          // Reset after animation completes
          setTimeout(() => setLoadingProgress(0), 500);
        }
      };
    }
  }, [isLoading]);

  // Register save function with parent component - critical for menu saving
  useEffect(() => {
    if (saveMenuSelections && saveMenu && !isLoading && menuState) {
      console.log('Registering save menu function with parent');
      
      // Don't re-register if already done
      if (saveRegistered.current) return;
      
      const wrappedSaveFunction = async () => {
        console.log("Save menu function called");
        try {
          if (!saveMenu) {
            throw new Error("Save menu function is not available");
          }
          
          await saveMenu();
          return Promise.resolve();
        } catch (error: any) {
          console.error('Error saving menu from WeddingMenuPlanner:', error);
          throw error; // Re-throw to let parent handle
        }
      };
      
      // Pass the wrapped function up to parent
      saveMenuSelections(wrappedSaveFunction);
      saveRegistered.current = true;
    }
    
    // Mark initial load as complete after first render with data
    if (!initialLoadComplete.current && !isLoading && menuState) {
      initialLoadComplete.current = true;
    }
  }, [saveMenu, saveMenuSelections, isLoading, menuState]);

  // Sync external isCustomMenu state with menu state - only when prop changes
  useEffect(() => {
    if (isCustomMenu !== undefined && isCustomMenu !== menuState.isCustomMenu && !isInternalUpdate) {
      console.log('External custom menu update:', isCustomMenu);
      handleMenuStateChange('isCustomMenu', isCustomMenu);
    }
  }, [isCustomMenu, menuState.isCustomMenu, handleMenuStateChange, isInternalUpdate]);

  // Sync menu state changes back to parent component for other components to use
  useEffect(() => {
    if (onMenuStateChange && menuState) {
      onMenuStateChange(menuState);
    }
    
    // Notify parent of custom menu changes, but only if it was changed internally
    // and not as a result of a prop change from the parent
    if (onCustomMenuToggle && isInternalUpdate) {
      console.log('Internal custom menu update:', menuState.isCustomMenu);
      onCustomMenuToggle(menuState.isCustomMenu);
      setIsInternalUpdate(false);
    }
  }, [menuState, onCustomMenuToggle, onMenuStateChange, isInternalUpdate]);

  // Handle internal changes to the custom menu toggle
  const handleInternalCustomMenuToggle = (value: boolean) => {
    console.log('Handling internal custom menu toggle:', value);
    setIsInternalUpdate(true);
    handleMenuStateChange('isCustomMenu', value);
  };

  if (isLoading) {
    return (
      <div className="mt-4 print:mt-0">
        <div className="py-6 space-y-4">
          <div className="text-center animate-pulse mb-2">Loading menu data...</div>
          <Progress 
            value={loadingProgress} 
            className="w-full max-w-md mx-auto h-2"
            aria-label="Loading progress"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 print:mt-0">
        <div className="py-6">
          <div className="text-red-600 text-center animate-in fade-in slide-in-from-top-4">
            {error}
            <div className="mt-2">
              <button 
                onClick={() => window.location.reload()} 
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 print:mt-0">
      {isSaving && (
        <div className="fixed inset-0 bg-black/5 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-4 rounded-md shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              <p>Saving menu...</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <MenuContent 
          menuState={menuState}
          onMenuStateChange={(field: keyof MenuState, value: any) => {
            if (field === 'isCustomMenu') {
              handleInternalCustomMenuToggle(value as boolean);
            } else {
              handleMenuStateChange(field, value);
            }
          }}
          onCanapeSelection={handleCanapeSelection}
          saveMenuSelections={saveMenu}
        />
        <Separator className="my-4 separator print:hidden" />
        <div className="notes-section">
          <NotesSection 
            notes={menuState.notes}
            onChange={(value) => handleMenuStateChange('notes', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default WeddingMenuPlanner;
