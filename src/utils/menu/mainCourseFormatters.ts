
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader, cleanItemDescription } from "./formatHelpers";
import { getMenuItemDescription } from "./menuItemDescriptions";

/**
 * Formats the main course section of the menu
 */
export const formatMainCourseSection = (menuState: MenuState): string => {
  if (!menuState.mainCourseType) return '';
  
  let section = formatSectionHeader('MAIN COURSE');
  
  section += `${getMenuItemDescription(menuState.mainCourseType)}\n`;
  
  // Format based on main course type
  if (menuState.mainCourseType === 'buffet') {
    section += formatBuffetMainCourse(menuState);
  } else if (menuState.mainCourseType === 'karoo') {
    section += formatKarooMainCourse(menuState);
  } else if (menuState.mainCourseType === 'plated') {
    section += formatPlatedMainCourse(menuState);
  }
  
  return section;
};

/**
 * Formats buffet-specific main course details
 */
const formatBuffetMainCourse = (menuState: MenuState): string => {
  let result = '';
  
  if (menuState.buffetMeatSelections.length > 0) {
    result += "Meat Selections:\n";
    menuState.buffetMeatSelections.forEach(item => {
      const description = getMenuItemDescription(item);
      // Log if the item key doesn't match any description
      if (description === item) {
        console.warn(`Missing description for meat item: ${item}`);
      }
      result += `• ${cleanItemDescription(description)}\n`;
    });
  }
  
  if (menuState.buffetVegetableSelections.length > 0) {
    result += "Vegetable Selections:\n";
    menuState.buffetVegetableSelections.forEach(item => {
      const description = getMenuItemDescription(item);
      // Log if the item key doesn't match any description
      if (description === item) {
        console.warn(`Missing description for vegetable item: ${item}`);
      }
      result += `• ${cleanItemDescription(description)}\n`;
    });
  }
  
  if (menuState.buffetStarchSelections.length > 0) {
    result += "Starch Selections:\n";
    menuState.buffetStarchSelections.forEach(item => {
      const description = getMenuItemDescription(item);
      // Log if the item key doesn't match any description
      if (description === item) {
        console.warn(`Missing description for starch item: ${item}`);
      }
      result += `• ${cleanItemDescription(description)}\n`;
    });
  }
  
  if (menuState.buffetSaladSelection) {
    result += "Salad Selection:\n";
    const description = getMenuItemDescription(menuState.buffetSaladSelection);
    // Log if the item key doesn't match any description
    if (description === menuState.buffetSaladSelection) {
      console.warn(`Missing description for salad item: ${menuState.buffetSaladSelection}`);
    }
    result += `• ${cleanItemDescription(description)}\n`;
  }
  
  return result;
};

/**
 * Formats karoo-specific main course details
 */
const formatKarooMainCourse = (menuState: MenuState): string => {
  let result = '';
  
  if (menuState.karooMeatSelection) {
    result += "Meat Selection:\n";
    result += `• ${cleanItemDescription(getMenuItemDescription(menuState.karooMeatSelection))}\n`;
  }
  
  if (menuState.karooStarchSelection.length > 0) {
    result += "Starch Selections:\n";
    menuState.karooStarchSelection.forEach(item => {
      result += `• ${cleanItemDescription(getMenuItemDescription(item))}\n`;
    });
  }
  
  if (menuState.karooVegetableSelections.length > 0) {
    result += "Vegetable Selections:\n";
    menuState.karooVegetableSelections.forEach(item => {
      result += `• ${cleanItemDescription(getMenuItemDescription(item))}\n`;
    });
  }
  
  if (menuState.karooSaladSelection) {
    result += "Salad Selection:\n";
    result += `• ${cleanItemDescription(getMenuItemDescription(menuState.karooSaladSelection))}\n`;
  }
  
  return result;
};

/**
 * Formats plated-specific main course details
 */
const formatPlatedMainCourse = (menuState: MenuState): string => {
  let result = '';
  
  if (menuState.platedMainSelection) {
    result += "Main Selection:\n";
    result += `• ${cleanItemDescription(getMenuItemDescription(menuState.platedMainSelection))}\n`;
  }
  
  if (menuState.platedSaladSelection) {
    result += "Salad Selection:\n";
    result += `• ${cleanItemDescription(getMenuItemDescription(menuState.platedSaladSelection))}\n`;
  }
  
  return result;
};
