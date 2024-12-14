export interface MenuSelections {
  event_code: string;
  is_custom: boolean | null;
  custom_menu_details: string | null;
  starter_type: string | null;
  canape_package: string | null;
  canape_selections: string[] | null;
  plated_starter: string | null;
  main_course_type: string | null;
  dessert_type: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}