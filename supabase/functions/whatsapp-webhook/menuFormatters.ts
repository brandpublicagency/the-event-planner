export const formatMenuSelection = (selection: string) => {
  return selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatMainCourseSection = (menu: any) => {
  let mainSection = '';

  switch (menu.main_course_type) {
    case 'buffet':
      mainSection = formatBuffetMenu(menu);
      break;
    case 'karoo':
      mainSection = formatKarooMenu(menu);
      break;
    case 'plated':
      mainSection = formatPlatedMenu(menu);
      break;
    default:
      mainSection = '*Main Course*\nNot selected';
  }

  return mainSection;
};

const formatBuffetMenu = (menu: any) => {
  let section = '*Main Course - Buffet Menu*\n';
  
  if (menu.buffet_meat_selections?.length) {
    section += `\n*Meat Selections:*\n${menu.buffet_meat_selections.map(formatMenuSelection).join('\n')}`;
  }
  if (menu.buffet_vegetable_selections?.length) {
    section += `\n\n*Vegetable Selections:*\n${menu.buffet_vegetable_selections.map(formatMenuSelection).join('\n')}`;
  }
  if (menu.buffet_starch_selections?.length) {
    section += `\n\n*Starch Selections:*\n${menu.buffet_starch_selections.map(formatMenuSelection).join('\n')}`;
  }
  if (menu.buffet_salad_selection) {
    section += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.buffet_salad_selection)}`;
  }
  
  return section;
};

const formatKarooMenu = (menu: any) => {
  let section = '*Main Course - Karoo Feast*\n';
  
  if (menu.karoo_meat_selection) {
    section += `\n*Meat Selection:*\n${formatMenuSelection(menu.karoo_meat_selection)}`;
  }
  if (menu.karoo_vegetable_selections?.length) {
    section += `\n\n*Vegetable Selections:*\n${menu.karoo_vegetable_selections.map(formatMenuSelection).join('\n')}`;
  }
  if (menu.karoo_starch_selection) {
    section += `\n\n*Starch Selection:*\n${formatMenuSelection(menu.karoo_starch_selection)}`;
  }
  if (menu.karoo_salad_selection) {
    section += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.karoo_salad_selection)}`;
  }
  
  return section;
};

const formatPlatedMenu = (menu: any) => {
  let section = '*Main Course - Plated Menu*\n';
  
  if (menu.plated_main_selection) {
    section += `\n*Main Selection:*\n${formatMenuSelection(menu.plated_main_selection)}`;
  }
  if (menu.plated_salad_selection) {
    section += `\n\n*Salad Selection:*\n${formatMenuSelection(menu.plated_salad_selection)}`;
  }
  
  return section;
};