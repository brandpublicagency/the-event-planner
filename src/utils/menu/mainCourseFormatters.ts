
import { MenuState } from "@/hooks/menuStateTypes";
import { formatSectionHeader } from "./formatHelpers";
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
      result += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  if (menuState.buffetVegetableSelections.length > 0) {
    result += "Vegetable Selections:\n";
    menuState.buffetVegetableSelections.forEach(item => {
      result += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  if (menuState.buffetStarchSelections.length > 0) {
    result += "Starch Selections:\n";
    menuState.buffetStarchSelections.forEach(item => {
      result += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  if (menuState.buffetSaladSelection) {
    result += "Salad Selection:\n";
    result += `• ${getMenuItemDescription(menuState.buffetSaladSelection)}\n`;
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
    result += `• ${getMenuItemDescription(menuState.karooMeatSelection)}\n`;
  }
  
  if (menuState.karooStarchSelection.length > 0) {
    result += "Starch Selections:\n";
    menuState.karooStarchSelection.forEach(item => {
      result += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  if (menuState.karooVegetableSelections.length > 0) {
    result += "Vegetable Selections:\n";
    menuState.karooVegetableSelections.forEach(item => {
      result += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  if (menuState.karooSaladSelection) {
    result += "Salad Selection:\n";
    result += `• ${getMenuItemDescription(menuState.karooSaladSelection)}\n`;
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
    result += `• ${getMenuItemDescription(menuState.platedMainSelection)}\n`;
  }
  
  if (menuState.platedSaladSelection) {
    result += "Salad Selection:\n";
    result += `• ${getMenuItemDescription(menuState.platedSaladSelection)}\n`;
  }
  
  return result;
};
