const formatSelection = (selection: string) => {
  if (!selection) return '';
  
  const menuItems: Record<string, string> = {
    'canapes': 'Canapés',
    'harvest': 'Harvest Table',
    'plated': 'Plated Starter',
    
    'standard': 'Standard Canapé Package',
    'premium': 'Premium Canapé Package',
    'deluxe': 'Deluxe Canapé Package',
    
    'caprese_salad': 'Caprese Salad',
    'prawn_cocktail': 'Prawn Cocktail',
    'mushroom_soup': 'Creamy Mushroom Soup',
    'beetroot_carpaccio': 'Beetroot Carpaccio',
    
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    'plated': 'Plated Menu',
    
    'lamb_chicken': 'Slow roasted leg of lamb and homemade chicken pie',
    'oxtail_chicken': 'Homemade oxtail pie and golden-brown chickens',
    
    'chicken_pie': 'Homemade chicken pie',
    'chicken_thighs': 'Roasted lemon & herb chicken thighs with chimichurri',
    'leg_of_lamb': 'Leg of lamb with a rich jus',
    'beef_fillet': 'Beef fillet medallions in creamy wild mushroom sauce',
    'oxtail_pie': 'Slow roasted oxtail pie',
    'glazed_gammon': 'Glazed gammon with sticky mustard & apple sauce',
    
    'lamb_shank': 'Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato',
    'beef_cut': 'Chef\'s cut of beef with mushroom or pepper sauce',
    'chicken_breast': 'Sun-dried tomato & feta-stuffed chicken breast in a basil cream sauce',
    
    'traditional': 'Traditional Baked Desserts',
    'individual': 'Individual Cakes',
    'bar': 'Dessert Bar',
    'canapes': 'Dessert Canapés',
    
    'chocolate_pudding': 'Self-saucing chocolate pudding',
    'date_pudding': 'Date & nut brandy pudding',
    'malva_pudding': 'Traditional malva pudding',
    'apple_pudding': 'Baked apple caramel pudding',
    'almond_pudding': 'Baked almond pudding with citrus & cinnamon syrup',
    
    'infused_water': 'Infused Water',
    'pink_lemonade': 'Pink Lemonade',
    'fruit_juice': 'Fruit Juice',
    'minty_mojito': 'Minty Mojito',
    'midnight_snack': 'Midnight Snack'
  };
  
  return menuItems[selection] || selection
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
          sections.push(`- ${formatSelection(canape)}`);
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
        menu.buffet_meat_selections.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
      }
      
      if (menu.buffet_vegetable_selections && menu.buffet_vegetable_selections.length > 0) {
        sections.push('Vegetables:');
        menu.buffet_vegetable_selections.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
      }
      
      if (menu.buffet_starch_selections && menu.buffet_starch_selections.length > 0) {
        sections.push('Starch:');
        menu.buffet_starch_selections.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
      }
      
      if (menu.buffet_salad_selection) {
        sections.push(`Salad: ${formatSelection(menu.buffet_salad_selection)}`);
      }
    } else if (menu.main_course_type === 'plated' && menu.plated_main_selection) {
      sections.push(`Plated Selection: ${formatSelection(menu.plated_main_selection)}`);
      
      if (menu.plated_salad_selection) {
        sections.push(`Salad: ${formatSelection(menu.plated_salad_selection)}`);
      }
    } else if (menu.main_course_type === 'karoo') {
      if (menu.karoo_meat_selection) {
        sections.push(`Karoo Meat: ${formatSelection(menu.karoo_meat_selection)}`);
      }
      
      if (menu.karoo_vegetable_selections && menu.karoo_vegetable_selections.length > 0) {
        sections.push('Karoo Vegetables:');
        menu.karoo_vegetable_selections.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
      }
      
      if (menu.karoo_starch_selection && menu.karoo_starch_selection.length > 0) {
        sections.push('Karoo Starch:');
        menu.karoo_starch_selection.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
      }
      
      if (menu.karoo_salad_selection) {
        sections.push(`Karoo Salad: ${formatSelection(menu.karoo_salad_selection)}`);
      }
    }
  }

  // Dessert section
  if (menu.dessert_type) {
    sections.push(`Dessert: ${formatSelection(menu.dessert_type)}`);
    
    if (menu.dessert_type === 'canapes' && menu.dessert_canapes && menu.dessert_canapes.length > 0) {
      sections.push('Dessert Canapés:');
      menu.dessert_canapes.forEach((item: string) => sections.push(`- ${formatSelection(item)}`));
    } else if (menu.dessert_type === 'individual' && menu.individual_cakes && menu.individual_cakes.length > 0) {
      sections.push('Individual Cakes:');
      menu.individual_cakes.forEach((item: string) => {
        const quantity = menu.individual_cake_quantities?.[item] || '';
        sections.push(`- ${formatSelection(item)}${quantity ? ` (x${quantity})` : ''}`);
      });
    } else if (menu.dessert_type === 'traditional' && menu.traditional_dessert) {
      sections.push(`Traditional Dessert: ${formatSelection(menu.traditional_dessert)}`);
    }
  }

  // Other selections
  if (menu.other_selections && menu.other_selections.length > 0) {
    sections.push('Additional Options:');
    menu.other_selections.forEach((item: string) => {
      const quantity = menu.other_selections_quantities?.[item] || '';
      sections.push(`- ${formatSelection(item)}${quantity ? ` (x${quantity})` : ''}`);
    });
  }

  // Notes
  if (menu.notes) {
    sections.push('\nNotes:', menu.notes);
  }

  return sections.join('\n');
};
