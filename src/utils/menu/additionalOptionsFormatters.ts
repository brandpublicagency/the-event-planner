
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the additional options section of the menu
 */
export const formatAdditionalOptionsSection = (menuState: MenuState): string => {
  if (!menuState.otherSelections || menuState.otherSelections.length === 0) return '';
  
  let section = formatSectionHeader('ADDITIONAL OPTIONS');
  
  menuState.otherSelections.forEach(option => {
    const quantity = menuState.otherSelectionsQuantities[option] || 0;
    // Remove bullet point
    section += `${cleanItemDescription(getMenuItemDescription(option))}${quantity > 0 ? ` (${quantity})` : ''}\n`;
  });
  
  return section;
};
