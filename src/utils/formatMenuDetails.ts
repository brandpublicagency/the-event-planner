export const formatMenuDetails = (menu: any) => {
  if (!menu) return "No menu information available";
  
  const sections = [];
  
  if (menu.is_custom) {
    sections.push('Custom Menu:', menu.custom_menu_details || 'Custom menu details not specified');
    return sections.join('\n');
  }

  // Starter section with specific handling for canapés
  if (menu.starter_type) {
    if (menu.starter_type === 'canapes' || menu.canape_package) {
      sections.push('Starter: Canapés');
      
      if (menu.canape_package) {
        sections.push(`Package: ${formatSelection(menu.canape_package)}`);
      }
      
      if (menu.canape_selections && menu.canape_selections.length > 0) {
        sections.push('Selections:');
        menu.canape_selections.forEach((canape: string) => {
          sections.push(`- ${canape}`);
        });
      } else {
        sections.push('No specific canapés selected yet');
      }
    } else if (menu.plated_starter) {
      sections.push(`Starter: ${formatSelection(menu.starter_type)} - ${formatSelection(menu.plated_starter)}`);
    } else {
      sections.push(`Starter: ${formatSelection(menu.starter_type)}`);
    }
  }

  // Main course section with type-specific details
  if (menu.main_course_type) {
    sections.push(`Main Course: ${formatSelection(menu.main_course_type)}`);
    
    // Add type-specific details
    if (menu.main_course_type === 'buffet' && menu.buffet_meat_selections) {
      sections.push('Buffet Selections:');
      if (menu.buffet_meat_selections && menu.buffet_meat_selections.length > 0) {
        sections.push('Meat:');
        menu.buffet_meat_selections.forEach((item: string) => sections.push(`- ${item}`));
      }
      
      if (menu.buffet_vegetable_selections && menu.buffet_vegetable_selections.length > 0) {
        sections.push('Vegetables:');
        menu.buffet_vegetable_selections.forEach((item: string) => sections.push(`- ${item}`));
      }
      
      if (menu.buffet_starch_selections && menu.buffet_starch_selections.length > 0) {
        sections.push('Starch:');
        menu.buffet_starch_selections.forEach((item: string) => sections.push(`- ${item}`));
      }
      
      if (menu.buffet_salad_selection) {
        sections.push(`Salad: ${menu.buffet_salad_selection}`);
      }
    } else if (menu.main_course_type === 'plated' && menu.plated_main_selection) {
      sections.push(`Plated Selection: ${menu.plated_main_selection}`);
      
      if (menu.plated_salad_selection) {
        sections.push(`Salad: ${menu.plated_salad_selection}`);
      }
    } else if (menu.main_course_type === 'karoo') {
      if (menu.karoo_meat_selection) {
        sections.push(`Karoo Meat: ${menu.karoo_meat_selection}`);
      }
      
      if (menu.karoo_vegetable_selections && menu.karoo_vegetable_selections.length > 0) {
        sections.push('Karoo Vegetables:');
        menu.karoo_vegetable_selections.forEach((item: string) => sections.push(`- ${item}`));
      }
      
      if (menu.karoo_starch_selection && menu.karoo_starch_selection.length > 0) {
        sections.push('Karoo Starch:');
        menu.karoo_starch_selection.forEach((item: string) => sections.push(`- ${item}`));
      }
      
      if (menu.karoo_salad_selection) {
        sections.push(`Karoo Salad: ${menu.karoo_salad_selection}`);
      }
    }
  }

  // Dessert section
  if (menu.dessert_type) {
    sections.push(`Dessert: ${formatSelection(menu.dessert_type)}`);
    
    if (menu.dessert_type === 'canapes' && menu.dessert_canapes && menu.dessert_canapes.length > 0) {
      sections.push('Dessert Canapés:');
      menu.dessert_canapes.forEach((item: string) => sections.push(`- ${item}`));
    } else if (menu.dessert_type === 'individual_cakes' && menu.individual_cakes && menu.individual_cakes.length > 0) {
      sections.push('Individual Cakes:');
      menu.individual_cakes.forEach((item: string) => sections.push(`- ${item}`));
    } else if (menu.dessert_type === 'traditional' && menu.traditional_dessert) {
      sections.push(`Traditional Dessert: ${menu.traditional_dessert}`);
    }
  }

  // Other selections
  if (menu.other_selections && menu.other_selections.length > 0) {
    sections.push('Other Selections:');
    menu.other_selections.forEach((item: string) => {
      const quantity = menu.other_selections_quantities?.[item] || '';
      sections.push(`- ${item}${quantity ? ` (${quantity})` : ''}`);
    });
  }

  // Notes
  if (menu.notes) {
    sections.push('\nNotes:', menu.notes);
  }

  return sections.join('\n');
};

const formatSelection = (selection: string) => {
  if (!selection) return '';
  
  return selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
