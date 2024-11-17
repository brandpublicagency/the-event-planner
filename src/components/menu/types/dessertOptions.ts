import { MenuOption } from './baseTypes';

export const dessertTypes: MenuOption[] = [
  { value: 'traditional', label: 'Traditional Baked Desserts', price: 95.00, priceType: 'per_person' },
  { value: 'canapes', label: 'Dessert Canapés', price: 100.00, priceType: 'per_person' },
  { value: 'cakes', label: 'Individual Cakes', price: 750.00, priceType: 'per_item' },
  { value: 'bar', label: 'Dessert Bar', price: 120.00, priceType: 'per_person' },
];

export const traditionalDessertOptions = [
  { value: 'chocolate_pudding', label: 'Self-saucing chocolate pudding' },
  { value: 'brandy_pudding', label: 'Date & nut brandy pudding' },
  { value: 'malva_pudding', label: 'Traditional malva pudding' },
  { value: 'apple_pudding', label: 'Baked apple caramel pudding' },
  { value: 'almond_pudding', label: 'Baked almond pudding with citrus & cinnamon syrup' },
];

export const dessertCanapeOptions = [
  { value: 'carrot_cupcakes', label: 'Carrot cupcakes with mascarpone frosting' },
  { value: 'brownies', label: 'Chocolate brownies' },
  { value: 'chocolate_cupcakes', label: 'Dark chocolate ganache cupcakes' },
  { value: 'chocolate_mousse', label: 'Dark or white chocolate mousse' },
  { value: 'pavlovas', label: 'Lemon curd & berry pavlovas' },
  { value: 'meringues', label: 'Lemon meringues' },
  { value: 'milk_tartlets', label: 'Milk tartlets' },
  { value: 'pecan_pies', label: 'Pecan nut pies' },
  { value: 'peppermint_crisp', label: 'Peppermint crisp treat' },
  { value: 'red_velvet', label: 'Red velvet cupcakes with cream cheese frosting' },
  { value: 'koeksisters', label: 'Traditional koeksisters' },
  { value: 'vanilla_cupcakes', label: 'Vanilla cupcakes with sweet butter frosting' },
];

export const individualCakeOptions = [
  { value: 'cheesecake', label: 'Baked cheesecake' },
  { value: 'pavlova_cake', label: 'Lemon curd and berry pavlova' },
  { value: 'chocolate_cake', label: 'Rich chocolate cake with dark chocolate ganache' },
  { value: 'carrot_cake', label: 'Carrot cake with cream cheese frosting' },
  { value: 'lemon_cake', label: 'Lemon & poppyseed cake with cream and mascarpone' },
];