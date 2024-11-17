import { CanapePackage, CanapeOption, PlatedStarterOption } from './baseTypes';

export const canapePackages: CanapePackage[] = [
  { value: '3', label: 'Choice of 3 Canapés', price: 120.00 },
  { value: '4', label: 'Choice of 4 Canapés', price: 150.00 },
  { value: '5', label: 'Choice of 5 Canapés', price: 185.00 },
  { value: '6', label: 'Choice of 6 Canapés', price: 220.00 },
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

export const platedStarterOptions: PlatedStarterOption[] = [
  { 
    value: 'mushroom_soup', 
    label: 'Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with Sourdough bread (v)' 
  },
  { 
    value: 'crostinis', 
    label: 'Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette (v)' 
  },
  { 
    value: 'seafood_cocktail', 
    label: 'Classic seafood cocktail served on fresh cos lettuce' 
  },
  { 
    value: 'risotto', 
    label: 'Wild mushroom and black truffle risotto (v)' 
  },
  { 
    value: 'pastry_parcel', 
    label: 'Fresh asparagus, hickory ham & brie pastry parcel (s)' 
  },
  { 
    value: 'philo_basket', 
    label: 'Phyllo basket with spinach and feta' 
  },
  { 
    value: 'halloumi', 
    label: 'Grilled halloumi fingers with lime yogurt & pomegranate (v)' 
  },
  { 
    value: 'butternut_salad', 
    label: 'Spiced butternut & beetroot salad with feta, seeds and a citrus dressing (v)' 
  }
];

export const starterTypes = [
  { value: 'harvest', label: 'Harvest Table', price: 130.00 },
  { value: 'canapes', label: 'Canapés', price: 0.00 },
  { value: 'plated', label: 'Plated Starter', price: 120.00 },
];