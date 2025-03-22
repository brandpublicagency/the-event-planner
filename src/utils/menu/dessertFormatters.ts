
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the dessert section of the menu
 */
export const formatDessertSection = (menuState: MenuState): string => {
  if (!menuState.dessertType) return '';
  
  let section = formatSectionHeader('DESSERT');
  
  // Include specific dessert type title with package info if applicable
  if (menuState.dessertType === 'canapes') {
    section += `DESSERT CANAPÉS (Choose ${menuState.dessertCanapes.length})\n`;
  } else if (menuState.dessertType === 'individual_cakes' || menuState.dessertType === 'cakes') {
    // Add proper heading for individual cakes section
    section += `INDIVIDUAL CAKES\n`;
  } else if (menuState.dessertType === 'traditional' && menuState.traditionalDessert) {
    section += `${getMenuItemDescription(menuState.dessertType)}\n`;
  }
  
  if (menuState.dessertType === 'traditional' && menuState.traditionalDessert) {
    // Remove bullet point
    section += `${cleanItemDescription(getMenuItemDescription(menuState.traditionalDessert))}\n`;
  } else if ((menuState.dessertType === 'individual_cakes' || menuState.dessertType === 'cakes') && menuState.individualCakes.length > 0) {
    menuState.individualCakes.forEach(cake => {
      const quantity = menuState.individual_cake_quantities?.[cake] || 0;
      if (quantity > 0) {
        // Include quantity for each cake when available
        section += `${cleanItemDescription(getMenuItemDescription(cake))} (x${quantity})\n`;
      } else {
        section += `${cleanItemDescription(getMenuItemDescription(cake))}\n`;
      }
    });
  } else if (menuState.dessertType === 'canapes' && menuState.dessertCanapes.length > 0) {
    menuState.dessertCanapes.forEach(item => {
      // Remove bullet point
      section += `${cleanItemDescription(getMenuItemDescription(item))}\n`;
    });
  }
  
  return section;
};
