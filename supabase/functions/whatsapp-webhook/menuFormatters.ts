
export const formatMenuSelection = (menuType: string): string => {
  return menuType ? menuType.trim() : 'Not specified';
};

export const formatMainCourseSection = (menu: any): string => {
  if (!menu) return '';
  
  return `*Main Course*
${menu.main_course_type ? formatMenuSelection(menu.main_course_type) : 'Not selected'}`;
};

export const formatEventMenu = (menu: any): string => {
  if (!menu) return 'No menu information available';

  let menuText = '';
  
  if (menu.is_custom) {
    menuText = '*Custom Menu*\n';
    if (menu.custom_menu_details) {
      menuText += `${menu.custom_menu_details}\n`;
    }
  } else {
    // Format Starter section with canape details
    if (menu.starter_type === 'canapes' || menu.canape_package) {
      menuText += `*Arrival & Starter: Canapés*\n`;
      
      if (menu.canape_package) {
        menuText += `Choice of ${menu.canape_package} Canapés\n`;
      }
      
      if (menu.canape_selections && menu.canape_selections.length > 0) {
        menu.canape_selections.forEach((canape: string) => {
          menuText += `- ${canape}\n`;
        });
        menuText += '\n';
      } else {
        menuText += 'No specific canapés selected yet\n\n';
      }
    } else if (menu.starter_type) {
      menuText += `*Arrival & Starter*\n${formatMenuSelection(menu.starter_type)}\n\n`;
    }
    
    if (menu.main_course_type) {
      menuText += `*Main Course*\n${formatMenuSelection(menu.main_course_type)}\n\n`;
    }
    
    if (menu.dessert_type) {
      menuText += `*Dessert*\n${formatMenuSelection(menu.dessert_type)}\n\n`;
    }
  }
  
  if (menu.notes) {
    menuText += `*Notes:* ${menu.notes}`;
  }
  
  return menuText.trim();
};
