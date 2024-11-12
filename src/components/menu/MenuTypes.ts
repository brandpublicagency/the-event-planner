export interface StarterType {
  value: string;
  label: string;
  price: string;
}

export interface CanapePackage {
  value: string;
  label: string;
  price: string;
}

export interface CanapeOption {
  value: string;
  label: string;
}

export interface PlatedStarterOption {
  value: string;
  label: string;
}

export const starterTypes: StarterType[] = [
  { value: 'harvest', label: 'Harvest Table', price: '120.00' },
  { value: 'canapes', label: 'Canapés', price: 'from 110.00' },
  { value: 'plated', label: 'Plated Starter', price: '105.00' },
];

export const canapePackages: CanapePackage[] = [
  { value: '3', label: 'Choice of 3 Canapés', price: '110.00' },
  { value: '4', label: 'Choice of 4 Canapés', price: '140.00' },
  { value: '5', label: 'Choice of 5 Canapés', price: '175.00' },
  { value: '6', label: 'Choice of 6 Canapés', price: '205.00' },
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
  { value: 'soup', label: 'Exotic wild mushroom soup, fresh tomato soup, or butternut soup served with sourdough bread (V)' },
  { value: 'crostini', label: 'Fresh tomato, basil & mozzarella crostinis with olive oil and balsamic vinaigrette (V)' },
  { value: 'seafood', label: 'Classic seafood cocktail served on fresh cos lettuce' },
  { value: 'risotto', label: 'Wild mushroom and black truffle risotto (V)' },
  { value: 'pastry', label: 'Fresh asparagus, hickory ham & brie pastry parcel (S)' },
  { value: 'phyllo', label: 'Phyllo basket with spinach and feta' },
  { value: 'halloumi', label: 'Grilled halloumi fingers with lime yogurt & pomegranate (V)' },
  { value: 'salad', label: 'Spiced butternut & beetroot salad with feta, seeds and citrus dressing (V)' },
];