
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the additional options section of the menu
 */
export const formatAdditionalOptionsSection = (menuState: MenuState): string => {
  if (!menuState.otherSelections || menuState.otherSelections.length === 0) return '';
  
  let section = formatSectionHeader('ADDITIONAL OPTIONS');
  
  menuState.otherSelections.forEach(option => {
    const quantity = menuState.otherSelectionsQuantities[option] || 0;
    section += `• ${getMenuItemDescription(option)}${quantity > 0 ? ` (${quantity})` : ''}\n`;
  });
  
  return section;
};
