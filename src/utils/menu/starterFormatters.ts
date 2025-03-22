
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
    // Don't show "Canapés - 3" but just show the package name directly
    if (menuState.selectedCanapePackage) {
      section += `CANAPÉS (${menuState.selectedCanapePackage})\n`;
    } else {
      section += `CANAPÉS\n`;
    }
    
    // Show full descriptions for each canapé
    menuState.selectedCanapes.forEach(canape => {
      if (canape) section += `• ${cleanItemDescription(getMenuItemDescription(canape))}\n`;
    });
  } else if (menuState.selectedStarterType === 'harvest') {
    section += `${getMenuItemDescription('harvest')}\n`;
  } else if (menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter) {
    section += `${getMenuItemDescription('plated')} - ${cleanItemDescription(getMenuItemDescription(menuState.selectedPlatedStarter))}\n`;
  }
  
  return section;
};
