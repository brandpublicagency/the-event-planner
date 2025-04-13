
export type MenuItem = {
  id: string;
  value: string;
  label: string;
  category: string | null;
  choice_id: string;
  choice: string;
  image_url: string | null;
  display_order?: number;
  created_at: string;
  updated_at: string;
};

export type MenuItemFormData = {
  value: string;
  label: string;
  category: string | null;
  choice_id: string;
  choice?: string;
  image_url: string | null;
  display_order?: number;
};
