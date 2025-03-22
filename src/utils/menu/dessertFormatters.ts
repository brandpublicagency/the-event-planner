
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the dessert section of the menu
 */
export const formatDessertSection = (menuState: MenuState): string => {
  if (!menuState.dessertType) return '';
  
  let section = formatSectionHeader('DESSERT');
  
  section += `${getMenuItemDescription(menuState.dessertType)}\n`;
  
  if (menuState.dessertType === 'traditional' && menuState.traditionalDessert) {
    section += `• ${cleanItemDescription(getMenuItemDescription(menuState.traditionalDessert))}\n`;
  } else if (menuState.dessertType === 'individual' && menuState.individualCakes.length > 0) {
    menuState.individualCakes.forEach(cake => {
      section += `• ${cleanItemDescription(getMenuItemDescription(cake))}\n`;
    });
  } else if (menuState.dessertType === 'bar' && menuState.dessertCanapes.length > 0) {
    menuState.dessertCanapes.forEach(item => {
      section += `• ${cleanItemDescription(getMenuItemDescription(item))}\n`;
    });
  }
  
  return section;
};
