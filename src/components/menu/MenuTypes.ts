export interface MenuOption {
  value: string;
  label: string;
  price: number;
  priceType: 'per_person' | 'per_item';
}

export interface CanapePackage {
  value: string;
  label: string;
}

export interface CanapeOption {
  value: string;
  label: string;
}

export const canapePackages: CanapePackage[] = [
  { value: '3', label: 'Choice of 3 Canapés' },
  { value: '4', label: 'Choice of 4 Canapés' },
  { value: '5', label: 'Choice of 5 Canapés' },
  { value: '6', label: 'Choice of 6 Canapés' },
];

export const canapeOptions: CanapeOption[] = [
  { value: 'slider', label: 'Beef & brie sliders with caramelised onion & tomato chutney' },
  { value: 'melon', label: 'Melon & parma ham skewers (S)' },
  { value: 'ricotta', label: 'Ricotta and Roasted Grape Crostini (V)' },
  { value: 'chicken', label: 'Sticky ginger & soy chicken satay' },
  { value: 'bruschetta', label: 'Bruschetta with roasted peppers, tomato & basil (V)' },
  { value: 'bobotie', label: 'Bobotie Springroll served with Homemade Chutney' },
  { value: 'kofta', label: 'Koftas with cucumber and mint yoghurt' },
  { value: 'caprese', label: 'Tomato, mozzarella & basil skewers (V)' },
  { value: 'prawn', label: 'Crumbed prawn with sweet Asian dipping sauce' },
  { value: 'pork', label: 'Pulled pork mini pitas with sour cream & pickled onion' },
];

export const platedStarterOptions = [
  { value: 'soup', label: 'Butternut Soup with Fresh Cream' },
  { value: 'carpaccio', label: 'Beef Carpaccio with Rocket and Parmesan' },
  { value: 'salad', label: 'Fresh Garden Salad' },
];

export const starterTypes = [
  { value: 'harvest', label: 'Harvest Table', price: 130.00 },
  { value: 'canapes_3', label: 'Choice of 3 Canapés', price: 120.00 },
  { value: 'canapes_4', label: 'Choice of 4 Canapés', price: 150.00 },
  { value: 'canapes_5', label: 'Choice of 5 Canapés', price: 185.00 },
  { value: 'canapes_6', label: 'Choice of 6 Canapés', price: 220.00 },
  { value: 'plated', label: 'Plated Starter', price: 120.00 },
];

export const mainCourseTypes: MenuOption[] = [
  { value: 'buffet', label: 'Buffet Menu', price: 380.00, priceType: 'per_person' },
  { value: 'karoo', label: 'Warm Karoo Feast', price: 400.00, priceType: 'per_person' },
  { value: 'plated', label: 'Plated Menu', price: 390.00, priceType: 'per_person' },
];

export const buffetMeatOptions = [
  { value: 'chicken_pie', label: 'Homemade chicken pie' },
  { value: 'chicken_thighs', label: 'Roasted lemon & herb chicken thighs with chimichurri' },
  { value: 'lamb_leg', label: 'Leg of lamb with a rich jus' },
  { value: 'beef_fillet', label: 'Beef fillet medallions in creamy wild mushroom sauce' },
  { value: 'oxtail_pie', label: 'Slow roasted oxtail pie' },
  { value: 'glazed_gammon', label: 'Glazed gammon with sticky mustard & apple sauce' },
];

export const buffetVegetableOptions = [
  { value: 'green_beans', label: 'Creamed green beans with potato and bacon' },
  { value: 'pumpkin_fritters', label: 'Pumpkin fritters in a sweet caramel custard' },
  { value: 'sweet_potato', label: 'Sweet potato bake with an almond & coconut crust' },
  { value: 'spinach_tart', label: 'Creamed spinach tart' },
  { value: 'cauliflower', label: 'Cheesy cauliflower & parmesan gratin' },
  { value: 'seasonal_veg', label: 'Seasonal roast vegetables' },
];

export const buffetStarchOptions = [
  { value: 'baby_potatoes', label: 'Baby potatoes in garlic & rosemary butter' },
  { value: 'potato_wedges', label: 'Parmesan roasted potato wedges' },
  { value: 'potato_mash', label: 'Buttery potato mash or creamy polenta' },
  { value: 'pepper_rice', label: 'Mixed pepper-flavoured basmati rice' },
  { value: 'wild_rice', label: 'White or brown wild rice with fresh herbs' },
  { value: 'couscous', label: 'Mediterranean couscous or bulgur wheat' },
];

export const karooMeatOptions = [
  { value: 'lamb_chicken', label: 'Slow roasted leg of lamb and homemade chicken pie' },
  { value: 'oxtail_chicken', label: 'Homemade oxtail pie and golden-brown chickens' },
];

export const karooStarchOptions = [
  { value: 'roast_potatoes', label: 'Traditional roast potatoes' },
  { value: 'wedges', label: 'Parmesan roasted potato wedges' },
  { value: 'basmati', label: 'Basmati rice' },
  { value: 'pepper_rice', label: 'Mixed pepper-flavoured basmati rice' },
];

export const karooVegetableOptions = [
  { value: 'green_beans', label: 'Green beans with butter & cream' },
  { value: 'cauliflower', label: 'Cauliflower and cheese sauce' },
  { value: 'sweet_potatoes', label: 'Traditional caramelised sweet potatoes' },
  { value: 'pumpkin_fritters', label: 'Pumpkin fritters in a sweet caramel custard' },
  { value: 'seasonal_veg', label: 'Seasonal roast vegetables' },
];

export const platedMainOptions = [
  { value: 'lamb_shank', label: 'Fall-off-the-bone lamb shank with demi-glace and creamy mashed potato served with crisp broccoli stems and honey-roasted carrots. (+ R 35.00 PP)' },
  { value: 'beef_cut', label: "Chef's cut of beef, whole green beans and potatoes wedges roasted in duck fat with parmesan & thyme. Served with mushroom or pepper sauce." },
  { value: 'chicken_breast', label: 'Sun-dried tomato & feta-stuffed chicken breast in a basil cream sauce with mediterranean couscous & seasonal roast vegetables.' },
];

export const saladOptions = [
  { value: 'asian_coleslaw', label: 'Asian coleslaw with sesame dressing' },
  { value: 'caprese', label: 'Caprese salad (tomato, mozzarella, basil)' },
  { value: 'broccoli_bacon', label: 'Creamy broccoli & bacon salad' },
  { value: 'halloumi_grape', label: 'Grilled halloumi and grape salad' },
  { value: 'mixed_green', label: 'Mixed green leaves with a mustard vinaigrette dressing' },
  { value: 'strawberry_beetroot', label: 'Strawberry, beetroot & pecan nut salad with balsamic glaze' },
  { value: 'greek', label: 'Traditional greek salad' },
  { value: 'beetroot', label: 'Traditional pickled baby beetroot salad' },
  { value: 'watermelon', label: 'Watermelon, feta & mint salad (s)' },
];

export const dessertTypes: MenuOption[] = [
  { value: 'traditional', label: 'Traditional Baked Desserts', price: 95.00, priceType: 'per_person' },
  { value: 'canapes', label: 'Dessert Canapés', price: 100.00, priceType: 'per_person' },
  { value: 'cakes', label: 'Individual Cakes', price: 750.00, priceType: 'per_item' },
  { value: 'bar', label: 'Dessert Bar', price: 120.00, priceType: 'per_person' },
];

export const otherOptions: MenuOption[] = [
  { value: 'infused_water', label: 'Infused Water', price: 275.00, priceType: 'per_item' },
  { value: 'pink_lemonade', label: 'Pink Lemonade', price: 440.00, priceType: 'per_item' },
  { value: 'fruit_juice', label: 'Fruit Juice', price: 440.00, priceType: 'per_item' },
  { value: 'minty_mojito', label: 'Minty Mojito', price: 770.00, priceType: 'per_item' },
  { value: 'midnight_snack', label: 'Midnight Snack', price: 65.00, priceType: 'per_person' },
];