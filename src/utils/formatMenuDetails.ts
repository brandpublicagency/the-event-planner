
import { MenuState } from "@/hooks/menuStateTypes";

// Utility function to format section headers
const formatSectionHeader = (title: string): string => {
  return `\n* ${title.toUpperCase()}:\n`;
};

// Utility function to get menu item descriptions
const getMenuItemDescription = (code: string): string => {
  const menuItemDescriptions: Record<string, string> = {
    // Starter Types
    'canapes': 'Canapés',
    'harvest': 'Harvest Table',
    'plated': 'Plated Starter',
    
    // Main Course Types
    'buffet': 'Buffet Menu',
    'karoo': 'Warm Karoo Feast',
    
    // Dessert Types
    'traditional': 'Traditional Baked Desserts',
    'individual': 'Individual Cakes',
    'bar': 'Dessert Bar',
    
    // Main Course - Karoo Meat
    'lamb_chicken': 'Slow roasted leg of lamb and homemade chicken pie',
    'oxtail_chicken': 'Homemade oxtail pie and golden-brown chickens',
    
    // Main Course - Buffet Meat
    'chicken_pie': 'Homemade chicken pie',
    'chicken_thighs': 'Roasted lemon & herb chicken thighs with chimichurri',
    'leg_of_lamb': 'Leg of lamb with a rich jus',
    'beef_fillet': 'Beef fillet medallions in creamy wild mushroom sauce',
    'oxtail_pie': 'Slow roasted oxtail pie',
    'glazed_gammon': 'Glazed gammon with sticky mustard & apple sauce',
    
    // Main Course - Plated Options
    'lamb_shank': 'Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato served with crisp broccoli stems and honey-roasted carrots',
    'beef_cut': 'Chef\'s cut of beef, whole green beans and potatoes wedges roasted in duck fat with parmesan & thyme. Served with mushroom or pepper sauce',
    'chicken_breast': 'Sun-dried tomato & feta-stuffed chicken breast in a basil cream sauce with mediterranean couscous & seasonal roast vegetables',
    
    // Plated Starters
    'halloumi': 'Grilled halloumi & grape salad with herb dressing and ciabatta croutes',
    
    // Starch
    'roast_potatoes': 'Traditional roast potatoes',
    'wedges': 'Parmesan roasted potato wedges',
    'basmati': 'Basmati rice',
    'pepper_rice': 'Mixed pepper-flavoured basmati rice',
    'baby_potatoes': 'Baby potatoes in garlic & rosemary butter',
    'potato_mash': 'Buttery potato mash',
    'polenta': 'Creamy polenta',
    'wild_rice': 'White or brown wild rice with fresh herbs',
    'couscous': 'Mediterranean couscous',
    'bulgur': 'Bulgur wheat',
    
    // Vegetables
    'green_beans': 'Green beans with butter & cream',
    'sweet_potatoes': 'Traditional caramelised sweet potatoes',
    'cauliflower': 'Cauliflower and cheese sauce',
    'pumpkin': 'Pumpkin fritters in a sweet caramel custard',
    'seasonal_veg': 'Seasonal roast vegetables',
    'creamed_beans': 'Creamed green beans with potato and bacon',
    'sweet_potato_bake': 'Sweet potato bake with an almond & coconut crust',
    'spinach_tart': 'Creamed spinach tart',
    'cauliflower_gratin': 'Cheesy cauliflower & parmesan gratin',
    
    // Salads
    'asian_coleslaw': 'Asian coleslaw with sesame dressing',
    'caprese': 'Caprese salad (tomato, mozzarella, basil)',
    'broccoli_bacon': 'Creamy broccoli & bacon salad',
    'halloumi_grape': 'Grilled halloumi and grape salad',
    'mixed_green': 'Mixed green leaves with a mustard vinaigrette dressing',
    'strawberry_beetroot': 'Strawberry, beetroot & pecan nut salad with balsamic glaze',
    'greek': 'Traditional greek salad',
    'beetroot': 'Traditional pickled baby beetroot salad',
    'watermelon_feta': 'Watermelon, feta & mint salad',
    
    // Traditional Desserts
    'chocolate_pudding': 'Self-saucing chocolate pudding',
    'date_pudding': 'Date & nut brandy pudding',
    'malva_pudding': 'Traditional malva pudding',
    'apple_pudding': 'Baked apple caramel pudding',
    'almond_pudding': 'Baked almond pudding with citrus & cinnamon syrup',
    
    // Individual Cakes
    'cheesecake': 'Baked cheesecake',
    'pavlova': 'Lemon curd and berry pavlova',
    'chocolate_cake': 'Rich chocolate cake with dark chocolate ganache',
    'carrot_cake': 'Carrot cake with cream cheese frosting',
    'lemon_cake': 'Lemon & poppyseed cake with cream and mascarpone',
    
    // Additional options
    'infused_water': 'Infused Water',
    'pink_lemonade': 'Pink Lemonade',
    'fruit_juice': 'Fruit Juice',
    'minty_mojito': 'Minty Mojito',
    'midnight_snack': 'Midnight Snack'
  };
  
  return menuItemDescriptions[code] || code;
};

// Format starter section
const formatStarterSection = (menuState: MenuState): string => {
  if (!menuState.selectedStarterType) return '';
  
  let section = formatSectionHeader('ARRIVAL & STARTER');
  
  if (menuState.selectedStarterType === 'canapes') {
    section += `${getMenuItemDescription('canapes')} - ${menuState.selectedCanapePackage}\n`;
    menuState.selectedCanapes.forEach(canape => {
      if (canape) section += `• ${getMenuItemDescription(canape)}\n`;
    });
  } else if (menuState.selectedStarterType === 'harvest') {
    section += `${getMenuItemDescription('harvest')}\n`;
  } else if (menuState.selectedStarterType === 'plated' && menuState.selectedPlatedStarter) {
    section += `${getMenuItemDescription('plated')} - ${getMenuItemDescription(menuState.selectedPlatedStarter)}\n`;
  }
  
  return section;
};

// Format main course section
const formatMainCourseSection = (menuState: MenuState): string => {
  if (!menuState.mainCourseType) return '';
  
  let section = formatSectionHeader('MAIN COURSE');
  
  section += `${getMenuItemDescription(menuState.mainCourseType)}\n`;
  
  // Format based on main course type
  if (menuState.mainCourseType === 'buffet') {
    if (menuState.buffetMeatSelections.length > 0) {
      section += "Meat Selections:\n";
      menuState.buffetMeatSelections.forEach(item => {
        section += `• ${getMenuItemDescription(item)}\n`;
      });
    }
    
    if (menuState.buffetVegetableSelections.length > 0) {
      section += "Vegetable Selections:\n";
      menuState.buffetVegetableSelections.forEach(item => {
        section += `• ${getMenuItemDescription(item)}\n`;
      });
    }
    
    if (menuState.buffetStarchSelections.length > 0) {
      section += "Starch Selections:\n";
      menuState.buffetStarchSelections.forEach(item => {
        section += `• ${getMenuItemDescription(item)}\n`;
      });
    }
    
    if (menuState.buffetSaladSelection) {
      section += "Salad Selection:\n";
      section += `• ${getMenuItemDescription(menuState.buffetSaladSelection)}\n`;
    }
  } else if (menuState.mainCourseType === 'karoo') {
    if (menuState.karooMeatSelection) {
      section += "Meat Selection:\n";
      section += `• ${getMenuItemDescription(menuState.karooMeatSelection)}\n`;
    }
    
    if (menuState.karooStarchSelection.length > 0) {
      section += "Starch Selections:\n";
      menuState.karooStarchSelection.forEach(item => {
        section += `• ${getMenuItemDescription(item)}\n`;
      });
    }
    
    if (menuState.karooVegetableSelections.length > 0) {
      section += "Vegetable Selections:\n";
      menuState.karooVegetableSelections.forEach(item => {
        section += `• ${getMenuItemDescription(item)}\n`;
      });
    }
    
    if (menuState.karooSaladSelection) {
      section += "Salad Selection:\n";
      section += `• ${getMenuItemDescription(menuState.karooSaladSelection)}\n`;
    }
  } else if (menuState.mainCourseType === 'plated') {
    if (menuState.platedMainSelection) {
      section += "Main Selection:\n";
      section += `• ${getMenuItemDescription(menuState.platedMainSelection)}\n`;
    }
    
    if (menuState.platedSaladSelection) {
      section += "Salad Selection:\n";
      section += `• ${getMenuItemDescription(menuState.platedSaladSelection)}\n`;
    }
  }
  
  return section;
};

// Format dessert section
const formatDessertSection = (menuState: MenuState): string => {
  if (!menuState.dessertType) return '';
  
  let section = formatSectionHeader('DESSERT');
  
  section += `${getMenuItemDescription(menuState.dessertType)}\n`;
  
  if (menuState.dessertType === 'traditional' && menuState.traditionalDessert) {
    section += `• ${getMenuItemDescription(menuState.traditionalDessert)}\n`;
  } else if (menuState.dessertType === 'individual' && menuState.individualCakes.length > 0) {
    menuState.individualCakes.forEach(cake => {
      section += `• ${getMenuItemDescription(cake)}\n`;
    });
  } else if (menuState.dessertType === 'bar' && menuState.dessertCanapes.length > 0) {
    menuState.dessertCanapes.forEach(item => {
      section += `• ${getMenuItemDescription(item)}\n`;
    });
  }
  
  return section;
};

// Format additional options section
const formatAdditionalOptionsSection = (menuState: MenuState): string => {
  if (!menuState.otherSelections || menuState.otherSelections.length === 0) return '';
  
  let section = formatSectionHeader('ADDITIONAL OPTIONS');
  
  menuState.otherSelections.forEach(option => {
    const quantity = menuState.otherSelectionsQuantities[option] || 0;
    section += `• ${getMenuItemDescription(option)}${quantity > 0 ? ` (${quantity})` : ''}\n`;
  });
  
  return section;
};

// Format notes section
const formatNotesSection = (menuState: MenuState): string => {
  if (!menuState.notes || menuState.notes.trim() === '') return '';
  
  let section = formatSectionHeader('ADDITIONAL NOTES');
  section += menuState.notes;
  
  return section;
};

// Format custom menu details
const formatCustomMenuDetails = (menuState: MenuState): string => {
  if (!menuState.isCustomMenu || !menuState.customMenuDetails) return '';
  
  return menuState.customMenuDetails;
};

// Main export function that formats all menu details
export const formatMenuDetails = (menuState: MenuState): string => {
  if (menuState.isCustomMenu) {
    return formatCustomMenuDetails(menuState);
  }
  
  let formattedDetails = '';
  
  // Add each section to the formatted details
  formattedDetails += formatStarterSection(menuState);
  formattedDetails += formatMainCourseSection(menuState);
  formattedDetails += formatDessertSection(menuState);
  formattedDetails += formatAdditionalOptionsSection(menuState);
  formattedDetails += formatNotesSection(menuState);
  
  return formattedDetails;
};
