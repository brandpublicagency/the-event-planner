import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MenuSelection,
  MenuService,
  useMenuState,
} from "@/contexts/MenuContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface WeddingMenuPlannerProps {
  eventCode: string;
  eventName?: string;
  onSuccess?: () => void;
  readOnly?: boolean;
  isCustomMenu?: boolean;
  onCustomMenuToggle?: (isCustom: boolean) => void;
  onMenuStateChange?: (menuState: any) => void;
  onSaveMenuCallback?: (callback: () => Promise<void>) => void;
}

export const WeddingMenuPlanner = React.forwardRef<
  HTMLDivElement,
  WeddingMenuPlannerProps
>(({ eventCode, eventName, onSuccess, readOnly = false, isCustomMenu, onCustomMenuToggle, onMenuStateChange, onSaveMenuCallback }, ref) => {
  const { menuState, setMenuState } = useMenuState();
  const { toast } = useToast();
  const [isCustom, setIsCustom] = useState(isCustomMenu || menuState.is_custom || false);
  const [customMenuDetails, setCustomMenuDetails] = useState(
    menuState.custom_menu_details || ""
  );
  const [canapePackage, setCanapePackage] = useState(
    menuState.canape_package || ""
  );
  const [canapeSelections, setCanapeSelections] = useState(
    menuState.canape_selections || []
  );
  const [starterType, setStarterType] = useState(menuState.starter_type || "");
  const [mainCourseType, setMainCourseType] = useState(
    menuState.main_course_type || ""
  );
  const [dessertType, setDessertType] = useState(menuState.dessert_type || "");
  const [notes, setNotes] = useState(menuState.notes || "");
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const menuService = new MenuService();

  useEffect(() => {
    // Load existing menu selections when the component mounts
    const loadMenuSelections = async () => {
      setIsLoading(true);
      try {
        const existingMenu = await menuService.getMenuSelections(eventCode);
        if (existingMenu) {
          setMenuState(existingMenu);
          setIsCustom(existingMenu.is_custom || false);
          setCustomMenuDetails(existingMenu.custom_menu_details || "");
          setCanapePackage(existingMenu.canape_package || "");
          setCanapeSelections(existingMenu.canape_selections || []);
          setStarterType(existingMenu.starter_type || "");
          setMainCourseType(existingMenu.main_course_type || "");
          setDessertType(existingMenu.dessert_type || "");
          setNotes(existingMenu.notes || "");
        }
      } catch (error) {
        console.error("Failed to load menu selections:", error);
        toast({
          title: "Error loading menu",
          description:
            "There was an error loading your menu selections. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuSelections();
  }, [eventCode, setMenuState, toast, menuService]);

  useEffect(() => {
    // Update the MenuContext when local state changes
    const updatedMenuState = {
      ...menuState,
      is_custom: isCustom,
      custom_menu_details: customMenuDetails,
      canape_package: canapePackage,
      canape_selections: canapeSelections,
      starter_type: starterType,
      main_course_type: mainCourseType,
      dessert_type: dessertType,
      notes: notes,
    };
    
    setMenuState(updatedMenuState);
    
    // Notify parent component about menu state changes if callback provided
    if (onMenuStateChange) {
      onMenuStateChange(updatedMenuState);
    }
    
    // Update custom menu toggle in parent if provided
    if (onCustomMenuToggle && isCustomMenu !== isCustom) {
      onCustomMenuToggle(isCustom);
    }
  }, [
    isCustom,
    customMenuDetails,
    canapePackage,
    canapeSelections,
    starterType,
    mainCourseType,
    dessertType,
    notes,
    setMenuState,
    menuState,
    onMenuStateChange,
    onCustomMenuToggle,
    isCustomMenu
  ]);

  // Provide the save function to parent component if needed
  useEffect(() => {
    if (onSaveMenuCallback) {
      onSaveMenuCallback(saveMenuSelections);
    }
  }, [onSaveMenuCallback, menuState]);

  // Fix the return type to match what the parent component expects
  const saveMenuSelections = async (): Promise<void> => {
    try {
      // Validate that at least one menu item is selected
      if (
        !isCustom &&
        !canapePackage &&
        !starterType &&
        !mainCourseType &&
        !dessertType
      ) {
        toast({
          title: "No menu items selected",
          description: "Please select at least one menu item to save.",
          variant: "warning",
        });
        return;
      }

      // Validate custom menu details if custom menu is selected
      if (isCustom && !customMenuDetails) {
        toast({
          title: "Custom menu details required",
          description: "Please provide details for your custom menu.",
          variant: "warning",
        });
        return;
      }

      // Just execute the operation and don't return the boolean result
      await menuService.saveMenuSelections(eventCode, menuState);
      
      if (onSuccess) {
        onSuccess();
      }
      
      toast({
        title: "Menu saved",
        description: "Your menu selections have been saved.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to save menu selections:", error);
      toast({
        title: "Error saving menu",
        description: "There was an error saving your menu selections.",
        variant: "destructive",
      });
    }
  };

  const handleCanapeSelectionChange = (value: string[]) => {
    setCanapeSelections(value);
  };

  return (
    <div ref={ref}>
      <Card>
        <CardHeader>
          <CardTitle>Menu Selections</CardTitle>
          <CardDescription>
            Customize the menu for this event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading menu selections...</div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isCustom">Custom Menu</Label>
                  <Checkbox
                    id="isCustom"
                    checked={isCustom}
                    onCheckedChange={(checked) => setIsCustom(!!checked)}
                    disabled={readOnly}
                  />
                  {isCustom && (
                    <div className="mt-2">
                      <Label htmlFor="customMenuDetails">
                        Custom Menu Details
                      </Label>
                      <Textarea
                        id="customMenuDetails"
                        placeholder="Enter custom menu details"
                        value={customMenuDetails}
                        onChange={(e) => setCustomMenuDetails(e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                  )}
                </div>

                {!isCustom && (
                  <div className="space-y-2">
                    <Label htmlFor="canapePackage">Canapé Package</Label>
                    <Input
                      type="text"
                      id="canapePackage"
                      placeholder="Enter canapé package"
                      value={canapePackage}
                      onChange={(e) => setCanapePackage(e.target.value)}
                      disabled={readOnly}
                    />
                  </div>
                )}
              </div>

              {!isCustom && (
                <div className="space-y-2">
                  <Label>Canapé Selections</Label>
                  <ToggleGroup
                    type="multiple"
                    value={canapeSelections}
                    onValueChange={handleCanapeSelectionChange}
                    className="w-full"
                    disabled={readOnly}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <ToggleGroupItem value="smoked-salmon">
                        Smoked Salmon
                      </ToggleGroupItem>
                      <ToggleGroupItem value="mini-quiches">
                        Mini Quiches
                      </ToggleGroupItem>
                      <ToggleGroupItem value="spring-rolls">
                        Spring Rolls
                      </ToggleGroupItem>
                      <ToggleGroupItem value="fruit-skewers">
                        Fruit Skewers
                      </ToggleGroupItem>
                    </div>
                  </ToggleGroup>
                </div>
              )}

              {!isCustom && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starterType">Starter Type</Label>
                    <Input
                      type="text"
                      id="starterType"
                      placeholder="Enter starter type"
                      value={starterType}
                      onChange={(e) => setStarterType(e.target.value)}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mainCourseType">Main Course Type</Label>
                    <Input
                      type="text"
                      id="mainCourseType"
                      placeholder="Enter main course type"
                      value={mainCourseType}
                      onChange={(e) => setMainCourseType(e.target.value)}
                      disabled={readOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dessertType">Dessert Type</Label>
                    <Input
                      type="text"
                      id="dessertType"
                      placeholder="Enter dessert type"
                      value={dessertType}
                      onChange={(e) => setDessertType(e.target.value)}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={readOnly}
                />
              </div>

              {!readOnly && (
                <Button onClick={saveMenuSelections}>Save Menu</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

WeddingMenuPlanner.displayName = "WeddingMenuPlanner";

export const useSaveMenuSelections = (eventCode: string) => {
  const { menuState } = useMenuState();
  const { toast } = useToast();
  const menuService = new MenuService();

  const saveMenuSelections = async (): Promise<void> => {
    try {
      await menuService.saveMenuSelections(eventCode, menuState);
      
      toast({
        title: "Menu saved",
        description: "Your menu selections have been saved.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to save menu selections:", error);
      toast({
        title: "Error saving menu",
        description: "There was an error saving your menu selections.",
        variant: "destructive",
      });
    }
  };

  return saveMenuSelections;
};

export const useGetMenuSelections = (eventCode: string) => {
  const { setMenuState } = useMenuState();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const menuService = new MenuService();

  const getMenuSelections = useCallback(async () => {
    setIsLoading(true);
    try {
      const existingMenu = await menuService.getMenuSelections(eventCode);
      if (existingMenu) {
        setMenuState(existingMenu);
      }
    } catch (error) {
      console.error("Failed to load menu selections:", error);
      toast({
        title: "Error loading menu",
        description:
          "There was an error loading your menu selections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [eventCode, setMenuState, toast]);

  return { getMenuSelections, isLoading };
};
