
export const formatMenuSelection = (menuType: string): string => {
  return menuType || 'Not specified';
};

export const formatMainCourseSection = (menu: any): string => {
  if (!menu) return '';
  
  return `*Main Course*
${menu.main_course_type ? formatMenuSelection(menu.main_course_type) : 'Not selected'}`;
};
