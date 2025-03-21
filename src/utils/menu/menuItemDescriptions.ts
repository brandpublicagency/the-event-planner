// Replace this file with the new version that cleans item descriptions
export const getMenuItemDescription = (itemKey: string): string => {
  // Clean the item key by replacing underscores with spaces first
  const cleanedKey = itemKey ? itemKey.replace(/_/g, ' ') : '';
  
  const descriptions: Record<string, string> = {
    // Starter types
    'canapes': 'Canapés',
    'harvest': 'Harvest Table',
    'plated': 'Plated Starter',
    
    // Canape options
    'crostini': 'Crostini with herbed cream cheese',
    'stuffed_mushrooms': 'Stuffed mushrooms with garlic herb butter',
    'salmon_blinis': 'Smoked salmon blinis with dill cream',
    'caprese_skewers': 'Caprese skewers with balsamic glaze',
    'prawn_cocktail': 'Prawn cocktail shots',
    'chicken_satay': 'Chicken satay skewers with peanut sauce',
    'beef_sliders': 'Mini beef sliders with caramelized onions',
    'vegetable_spring_rolls': 'Vegetable spring rolls with sweet chili sauce',
    'bruschetta': 'Tomato and basil bruschetta',
    'mini_quiches': 'Assorted mini quiches',
    
    // Plated starter options
    'prawn_avocado': 'Prawn and avocado cocktail with Marie Rose sauce',
    'pear_salad': 'Pear and blue cheese salad with candied walnuts',
    'salmon_starter': 'Smoked salmon with capers, red onion and lemon',
    'mushroom_soup': 'Creamy mushroom soup with truffle oil',
    'tomato_soup': 'Roasted tomato and basil soup',
    'butternut_soup': 'Butternut soup with toasted seeds',
    'carpaccio': 'Beef carpaccio with rocket and parmesan',
    
    // Main course types
    'buffet': 'Buffet Menu',
    'karoo': 'Traditional Karoo Menu',
    
    // Buffet meat options
    'roast_beef': 'Roast beef with red wine jus',
    'roast_lamb': 'Slow-roasted lamb with mint sauce',
    'chicken_thighs': 'Roasted lemon & herb chicken thighs with chimichurri',
    'lamb_leg': 'Roasted lamb leg with rosemary and garlic',
    'pork_belly': 'Crispy pork belly with apple sauce',
    'beef_lasagne': 'Classic beef lasagne',
    'chicken_curry': 'Mild chicken curry with accompaniments',
    'beef_bourguignon': 'Beef bourguignon with baby onions',
    
    // Buffet vegetable options
    'roast_vegetables': 'Seasonal roast vegetables',
    'green_beans': 'Green beans with toasted almonds',
    'glazed_carrots': 'Honey and thyme glazed carrots',
    'creamed_spinach': 'Creamed spinach with nutmeg',
    'grilled_vegetables': 'Mediterranean grilled vegetables',
    'cauliflower_cheese': 'Cauliflower cheese bake',
    'pumpkin_fritters': 'Cinnamon sugar pumpkin fritters',
    'ratatouille': 'Ratatouille',
    
    // Buffet starch options
    'roast_potatoes': 'Herb roasted potatoes',
    'potato_gratin': 'Potato and leek gratin',
    'rice_pilaf': 'Rice pilaf with toasted nuts',
    'wild_rice': 'White or brown wild rice with fresh herbs',
    'potato_wedges': 'Crispy seasoned potato wedges',
    'sweet_potato': 'Sweet potato mash with cinnamon',
    'couscous': 'Mediterranean couscous',
    'garlic_bread': 'Garlic and herb bread',
    
    // Salad options
    'greek_salad': 'Greek salad with feta and olives',
    'caesar_salad': 'Caesar salad with garlic croutons',
    'pasta_salad': 'Mediterranean pasta salad',
    'green_salad': 'Fresh garden green salad',
    'potato_salad': 'Creamy potato salad',
    'coleslaw': 'Classic coleslaw',
    'bean_salad': 'Three bean salad with herbs',
    'caprese_salad': 'Caprese salad (tomato, mozzarella, basil)',
    
    // Plated main options
    'beef_fillet': 'Beef fillet with red wine reduction',
    'rack_of_lamb': 'Herb-crusted rack of lamb',
    'chicken_supreme': 'Chicken supreme with thyme jus',
    'salmon_fillet': 'Pan-seared salmon fillet with lemon butter',
    'vegetable_wellington': 'Vegetable wellington',
    'pork_tenderloin': 'Pork tenderloin with apple compote',
    'duck_breast': 'Duck breast with cherry sauce',
    'stuffed_chicken': 'Stuffed chicken breast with spinach and feta',
    
    // Karoo meat options
    'lamb_potjie': 'Traditional lamb potjie',
    'bobotie': 'Cape Malay bobotie with yellow rice',
    'braai_meat': 'Selection of traditional braai meats',
    'oxtail_stew': 'Slow-cooked oxtail stew',
    'sosaties': 'Lamb sosaties with apricot glaze',
    'venison_pie': 'Venison pie with red wine gravy',
    'karoo_lamb': 'Karoo lamb chops with rosemary',
    'boerewors': 'Traditional boerewors with chakalaka',
    
    // Karoo starch options
    'pap': 'Creamy pap with tomato sauce',
    'roosterkoek': 'Grilled roosterkoek',
    'pot_bread': 'Traditional pot bread',
    'sweet_potato_braai': 'Sweet potatoes cooked on the braai',
    'samp_beans': 'Samp and beans (umngqusho)',
    'mealie_pap': 'Mealie pap with chakalaka',
    'vetkoek': 'Vetkoek with savory mince',
    'yellow_rice': 'Yellow rice with raisins',
    
    // Karoo vegetable options
    'braai_butternut': 'Braai butternut with honey and cinnamon',
    'corn_cobs': 'Grilled corn on the cob',
    'braai_mushrooms': 'Garlic braai mushrooms',
    'gem_squash': 'Gem squash with sweetcorn filling',
    'green_beans_potatoes': 'Green beans and potato stew',
    'beetroot_salad': 'Traditional beetroot salad',
    'braai_vegetables': 'Mixed braai vegetables',
    
    // Dessert types
    'traditional': 'Traditional Dessert',
    'bar': 'Dessert Canapés',
    'cakes': 'Individual Cakes',
    'individual': 'Individual Cakes',
    
    // Traditional desserts
    'malva_pudding': 'Malva pudding with custard',
    'milk_tart': 'Traditional milk tart',
    'bread_pudding': 'Bread and butter pudding',
    'peppermint_tart': 'Peppermint crisp tart',
    'apple_crumble': 'Apple crumble with cinnamon',
    'trifle': 'Trifle with fresh berries',
    'cheesecake': 'Baked cheesecake',
    'chocolate_mousse': 'Chocolate mousse',
    
    // Dessert canapes
    'mini_pavlovas': 'Mini pavlovas with fresh fruit',
    'chocolate_truffles': 'Assorted chocolate truffles',
    'fruit_skewers': 'Fresh fruit skewers with honey yogurt dip',
    'mini_brownies': 'Mini chocolate brownies',
    'dessert_shots': 'Assorted dessert shots',
    'macarons': 'Assorted macarons',
    'petit_fours': 'Selection of petit fours',
    'mini_tarts': 'Mini fruit tarts',
    
    // Individual cakes
    'carrot_cake': 'Carrot cake with cream cheese frosting',
    'chocolate_cake': 'Rich chocolate cake',
    'lemon_cake': 'Lemon drizzle cake',
    'red_velvet': 'Red velvet cake',
    'coffee_cake': 'Coffee and walnut cake',
    'vanilla_cake': 'Vanilla sponge cake with buttercream',
    'fruit_cake': 'Traditional fruit cake',
    'rainbow_cake': 'Rainbow layer cake',
    
    // Other selections
    'coffee_tea': 'Coffee and Tea Station',
    'cheese_board': 'Cheese Board with Accompaniments',
    'midnight_snack': 'Midnight Snack',
    'champagne_toast': 'Champagne Toast',
    'fruit_juice': 'Fruit Juice',
    'water': 'Still and Sparkling Water',
    'punch': 'Non-alcoholic Fruit Punch',
    'pink_lemonade': 'Pink Lemonade',
    'mojito': 'Non-alcoholic Mojito',
    'virgin_margarita': 'Virgin Margarita',
    'sangria': 'Non-alcoholic Sangria',
    'smoothies': 'Assorted Fruit Smoothies',
    'minty_mojito': 'Minty Mojito',
    'infused_water': 'Infused Water'
  };
  
  // Return the description if it exists, otherwise return the key with underscores replaced by spaces
  return descriptions[itemKey] || cleanedKey;
};
