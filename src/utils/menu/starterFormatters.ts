
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
    section += `${getMenuItemDescription('canapes')} - ${menuState.selectedCanapePackage}\n`;
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
