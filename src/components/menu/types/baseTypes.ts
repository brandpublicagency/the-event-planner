export interface MenuOption {
  value: string;
  label: string;
  price: number;
  priceType: 'per_person' | 'per_item';
}

export interface CanapePackage {
  value: string;
  label: string;
  price: number;
}

export interface CanapeOption {
  value: string;
  label: string;
}

export interface PlatedStarterOption {
  value: string;
  label: string;
}