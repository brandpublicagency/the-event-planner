
export type MenuChoice = {
  id: string;
  section_id: string;
  value: string;
  label: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  choice_type?: string;
};

export type MenuChoiceFormData = Omit<MenuChoice, 'id' | 'created_at' | 'updated_at'>;
