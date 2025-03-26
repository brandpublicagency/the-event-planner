
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the starter section of the menu
 */
export const formatStarterSection = (menuState: MenuState): string => {
  if (!menuState.selectedStarterType) return '';
  
  let section = formatSectionHeader('ARRIVAL & STARTER');
  
  if (menuState.selectedStarterType === 'canapes') {
    // First add the canapé package selection
    if (menuState.selectedCanapePackage) {
      const packageNumber = menuState.selectedCanapePackage;
      section += `Choice of ${packageNumber} Canapés\n\n`;
    }
    
    // Then list each selected canapé
    menuState.selectedCanapes.forEach(canape => {
      // Remove bullet points and add selected canapés
      if (canape) section += `${cleanItemDescription(getMenuItemDescription(canape))}\n`;
    });
  } else if (menuState.selectedStarterType === 'starter_canapes') {
    // Don't show "Canapés - 3" but just the full canapé descriptions directly
    menuState.selectedCanapes.forEach(canape => {
      // Remove bullet points
      if (canape) section += `${cleanItemDescription(getMenuItemDescription(canape))}\n`;
    });
  } else if (menuState.selectedStarterType === 'harvest') {
    section += `${getMenuItemDescription('harvest')}\n`;
  } else if (menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter) {
    // Check if we have a proper description for this plated starter item
    const description = getMenuItemDescription(menuState.selectedPlatedStarter);
    if (description === menuState.selectedPlatedStarter) {
      // If no description is found, use a more readable version of the key
      section += `${cleanItemDescription(menuState.selectedPlatedStarter)}\n`;
    } else {
      // Use the description from our mapping
      section += `${cleanItemDescription(description)}\n`;
    }
  }
  
  return section;
};
