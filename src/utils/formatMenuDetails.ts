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
    'halloumi_grape': 'Grilled halloumi and grape salad with rocket and a balsamic reduction',
    
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    'plated_main': 'Plated Menu',
    
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
    'canapes_dessert': 'Dessert Canapés',
    'cakes': 'Individual Cakes',
    
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
    sections.push('Custom Menu', menu.custom_menu_details || 'Custom menu details not specified');
    return sections.join('\n\n');
  }

  // Starter section with specific handling for canapés
  if (menu.selectedStarterType) {
    sections.push('ARRIVAL & STARTER');
    
    if (menu.selectedStarterType === 'canapes') {
      sections.push(`${formatSelection(menu.selectedStarterType)}`);
      
      if (menu.selectedCanapePackage) {
        sections.push(`Package: ${formatSelection(menu.selectedCanapePackage)}`);
      }
      
      if (menu.selectedCanapes && menu.selectedCanapes.length > 0) {
        const canapeItems = menu.selectedCanapes
          .filter((canape: string) => canape)
          .map((canape: string) => `• ${formatSelection(canape)}`)
          .join('\n');
        
        if (canapeItems) {
          sections.push(canapeItems);
        }
      } else {
        sections.push('No specific canapés selected yet');
      }
    } else if (menu.selectedStarterType === 'plated' && menu.selectedPlatedStarter) {
      sections.push(`${formatSelection(menu.selectedStarterType)}`, `• ${formatSelection(menu.selectedPlatedStarter)}`);
    } else {
      sections.push(`${formatSelection(menu.selectedStarterType)}`);
    }
    
    sections.push('');
  }

  // Main course section with type-specific details
  if (menu.mainCourseType) {
    sections.push('MAIN COURSE');
    sections.push(`${formatSelection(menu.mainCourseType)}`);
    
    // Add type-specific details
    if (menu.mainCourseType === 'buffet') {
      if (menu.buffetMeatSelections && menu.buffetMeatSelections.length > 0) {
        sections.push('Meat:');
        const meatItems = menu.buffetMeatSelections
          .map((item: string) => `• ${formatSelection(item)}`)
          .join('\n');
        sections.push(meatItems);
      }
      
      if (menu.buffetStarchSelections && menu.buffetStarchSelections.length > 0) {
        sections.push('Starch:');
        const starchItems = menu.buffetStarchSelections
          .map((item: string) => `• ${formatSelection(item)}`)
          .join('\n');
        sections.push(starchItems);
      }
      
      if (menu.buffetVegetableSelections && menu.buffetVegetableSelections.length > 0) {
        sections.push('Vegetables:');
        const vegItems = menu.buffetVegetableSelections
          .map((item: string) => `• ${formatSelection(item)}`)
          .join('\n');
        sections.push(vegItems);
      }
      
      if (menu.buffetSaladSelection) {
        sections.push(`Salad:\n• ${formatSelection(menu.buffetSaladSelection)}`);
      }
    } else if (menu.mainCourseType === 'plated_main') {
      if (menu.platedMainSelection) {
        sections.push(`Main Selection:\n• ${formatSelection(menu.platedMainSelection)}`);
      }
      
      if (menu.platedSaladSelection) {
        sections.push(`Salad:\n• ${formatSelection(menu.platedSaladSelection)}`);
      }
    } else if (menu.mainCourseType === 'karoo') {
      if (menu.karooMeatSelection) {
        sections.push(`Meat:\n• ${formatSelection(menu.karooMeatSelection)}`);
      }
      
      if (menu.karooStarchSelection && menu.karooStarchSelection.length > 0) {
        sections.push('Starch:');
        const starchItems = menu.karooStarchSelection
          .map((item: string) => `• ${formatSelection(item)}`)
          .join('\n');
        sections.push(starchItems);
      }
      
      if (menu.karooVegetableSelections && menu.karooVegetableSelections.length > 0) {
        sections.push('Vegetables:');
        const vegItems = menu.karooVegetableSelections
          .map((item: string) => `• ${formatSelection(item)}`)
          .join('\n');
        sections.push(vegItems);
      }
      
      if (menu.karooSaladSelection) {
        sections.push(`Salad:\n• ${formatSelection(menu.karooSaladSelection)}`);
      }
    }
    
    sections.push('');
  }

  // Dessert section - Handle both 'canapes' and 'cakes' types
  if (menu.dessertType) {
    sections.push('DESSERT');
    sections.push(`${formatSelection(menu.dessertType)}`);
    
    if ((menu.dessertType === 'canapes' || menu.dessertType === 'canapes_dessert') && menu.dessertCanapes && menu.dessertCanapes.length > 0) {
      const canapeItems = menu.dessertCanapes
        .map((item: string) => `• ${formatSelection(item)}`)
        .join('\n');
      sections.push(canapeItems);
    } else if ((menu.dessertType === 'individual' || menu.dessertType === 'cakes') && menu.individualCakes && menu.individualCakes.length > 0) {
      const cakeItems = menu.individualCakes
        .map((item: string) => {
          // Don't show quantities in the printed version as per the new design
          return `• ${formatSelection(item)}`;
        })
        .join('\n');
      sections.push(cakeItems);
    } else if (menu.dessertType === 'traditional' && menu.traditionalDessert) {
      sections.push(`• ${formatSelection(menu.traditionalDessert)}`);
    }
    
    sections.push('');
  }

  // Other selections
  if (menu.otherSelections && menu.otherSelections.length > 0) {
    sections.push('ADDITIONAL OPTIONS');
    const otherItems = menu.otherSelections
      .map((item: string) => {
        // Show items without quantities in the printed version
        return `• ${formatSelection(item)}`;
      })
      .join('\n');
    sections.push(otherItems);
    
    sections.push('');
  }

  // Notes
  if (menu.notes) {
    sections.push('NOTES', menu.notes);
  }

  return sections.join('\n');
};
