
export type MenuSection = {
  id: string;
  value: string;
  label: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuSectionFormData = Omit<MenuSection, 'id' | 'created_at' | 'updated_at'>;
