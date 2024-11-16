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

export const platedStarterOptions = [
  { value: 'soup', label: 'Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with sourdough bread (V)' },
  { value: 'crostini', label: 'Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette (V)' },
  { value: 'seafood', label: 'Classic seafood cocktail served on fresh cos lettuce' },
  { value: 'risotto', label: 'Wild mushroom and black truffle risotto (V)' },
  { value: 'pastry', label: 'Fresh asparagus, hickory ham & brie pastry parcel (S)' },
  { value: 'phyllo', label: 'Phyllo basket with spinach and feta' },
  { value: 'halloumi', label: 'Grilled halloumi fingers with lime yogurt & pomegranate (V)' },
  { value: 'salad', label: 'Spiced butternut & beetroot salad with feta, seeds and citrus dressing (V)' },
];