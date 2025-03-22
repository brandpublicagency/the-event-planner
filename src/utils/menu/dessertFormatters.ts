
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the dessert section of the menu
 */
export const formatDessertSection = (menuState: MenuState): string => {
  if (!menuState.dessertType) return '';
  
  // Debug log for dessert formatting
  console.log("Formatting dessert section:", {
    dessertType: menuState.dessertType,
    traditional: menuState.traditionalDessert,
    canapes: menuState.dessertCanapes?.length || 0,
    cakes: menuState.individualCakes?.length || 0
  });
  
  let section = formatSectionHeader('DESSERT');
  
  // Map 'canapes' to 'dessert_canapes' for description lookup
  const dessertTypeKey = menuState.dessertType === 'canapes' ? 'dessert_canapes' : menuState.dessertType;
  section += `${getMenuItemDescription(dessertTypeKey)}\n`;
  
  if (menuState.dessertType === 'traditional' && menuState.traditionalDessert) {
    section += `• ${cleanItemDescription(getMenuItemDescription(menuState.traditionalDessert))}\n`;
  } else if (menuState.dessertType === 'individual' || menuState.dessertType === 'cakes') {
    // Handle both 'individual' and 'cakes' types the same way
    if (menuState.individualCakes && menuState.individualCakes.length > 0) {
      menuState.individualCakes.forEach(cake => {
        section += `• ${cleanItemDescription(getMenuItemDescription(cake))}\n`;
      });
    }
  } else if (menuState.dessertType === 'bar' || menuState.dessertType === 'canapes') {
    // Handle both 'bar' and 'canapes' types the same way
    if (menuState.dessertCanapes && menuState.dessertCanapes.length > 0) {
      menuState.dessertCanapes.forEach(item => {
        section += `• ${cleanItemDescription(getMenuItemDescription(item))}\n`;
      });
    }
  }
  
  return section;
};
