
import { MenuState } from "@/hooks/menuStateTypes";
import { formatStarterSection } from "./starterFormatters";
import { formatMainCourseSection } from "./mainCourseFormatters";
import { formatDessertSection } from "./dessertFormatters";
import { formatAdditionalOptionsSection } from "./additionalOptionsFormatters";
import { formatNotesSection, formatCustomMenuDetails } from "./formatHelpers";

/**
 * Main export function that formats all menu details
 */
export const formatMenuDetails = (menuState: MenuState): string => {
  // Debug log for menu formatting
  console.log("Formatting menu details:", {
    isCustom: menuState.isCustomMenu,
    mainCourseType: menuState.mainCourseType,
    starterType: menuState.selectedStarterType,
    dessertType: menuState.dessertType
  });

  if (menuState.isCustomMenu) {
    return formatCustomMenuDetails(menuState.customMenuDetails);
  }
  
  let formattedDetails = '';
  
  // Add each section to the formatted details
  formattedDetails += formatStarterSection(menuState);
  formattedDetails += formatMainCourseSection(menuState);
  formattedDetails += formatDessertSection(menuState);
  formattedDetails += formatAdditionalOptionsSection(menuState);
  formattedDetails += formatNotesSection(menuState.notes);
  
  return formattedDetails;
};
