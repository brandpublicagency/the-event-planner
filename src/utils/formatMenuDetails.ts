export const formatMenuDetails = (menu: any) => {
  const sections = [];
  
  if (menu.is_custom) {
    sections.push('Custom Menu:', menu.custom_menu_details);
    return sections.join('\n');
  }

  if (menu.starter_type) {
    sections.push(`Starter: ${formatSelection(menu.starter_type)}`);
  }

  if (menu.main_course_type) {
    sections.push(`Main Course: ${formatSelection(menu.main_course_type)}`);
  }

  if (menu.dessert_type) {
    sections.push(`Dessert: ${formatSelection(menu.dessert_type)}`);
  }

  if (menu.notes) {
    sections.push('\nNotes:', menu.notes);
  }

  return sections.join('\n');
};

const formatSelection = (selection: string) => {
  return selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};