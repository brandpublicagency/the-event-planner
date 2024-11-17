import { MenuOption } from './baseTypes';

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