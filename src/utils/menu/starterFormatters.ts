
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the starter section of the menu
 */
export const formatStarterSection = (menuState: MenuState): string => {
  if (!menuState.selectedStarterType) return '';
  
  let section = formatSectionHeader('ARRIVAL & STARTER');
  
  if (menuState.selectedStarterType === 'starter_canapes') {
    // Don't show "Canapés - 3" but just the full canapé descriptions directly
    menuState.selectedCanapes.forEach(canape => {
      // Remove bullet points
      if (canape) section += `${cleanItemDescription(getMenuItemDescription(canape))}\n`;
    });
  } else if (menuState.selectedStarterType === 'harvest') {
    section += `${getMenuItemDescription('harvest')}\n`;
  } else if (menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter) {
    // Fix: Don't include "Plated Menu - " prefix, just show the description directly
    section += `${cleanItemDescription(getMenuItemDescription(menuState.selectedPlatedStarter))}\n`;
  }
  
  return section;
};
