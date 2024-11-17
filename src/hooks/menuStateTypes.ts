export interface MenuState {
  isCustomMenu: boolean;
  customMenuDetails: string;
  selectedStarterType: string;
  selectedCanapePackage: string;
  selectedCanapes: string[];
  selectedPlatedStarter: string;
  mainCourseType: string;
  buffetMeatSelections: string[];
  buffetVegetableSelections: string[];
  buffetStarchSelections: string[];
  buffetSaladSelection: string;
  karooMeatSelection: string;
  karooStarchSelection: string[];
  karooVegetableSelections: string[];
  karooSaladSelection: string;
  platedMainSelection: string;
  platedSaladSelection: string;
  dessertType: string;
  traditionalDessert: string;
  dessertCanapes: string[];
  individualCakes: string[];
  otherSelections: string[];
  notes: string;
}

export interface SaveMenuData {
  event_code: string;
  is_custom: boolean;
  custom_menu_details: string;
  starter_type: string;
  canape_package: string;
  canape_selections: string[];
  plated_starter: string;
  main_course_type: string;
  buffet_meat_selections: string[];
  buffet_vegetable_selections: string[];
  buffet_starch_selections: string[];
  buffet_salad_selection: string;
  karoo_meat_selection: string;
  karoo_starch_selection: string[];
  karoo_vegetable_selections: string[];
  karoo_salad_selection: string;
  plated_main_selection: string;
  plated_salad_selection: string;
  dessert_type: string;
  traditional_dessert: string;
  dessert_canapes: string[];
  individual_cakes: string[];
  other_selections: string[];
  notes: string;
  starter_price: number;
  main_course_price: number;
  dessert_price: number;
  other_total_price: number;
}

// Add a type for the database response
export interface MenuSelectionResponse {
  buffet_meat_selections: string[];
  buffet_salad_selection: string;
  buffet_starch_selections: string[];
  buffet_vegetable_selections: string[];
  canape_package: string;
  canape_selections: string[];
  custom_menu_details: string;
  dessert_type: string;
  event_code: string;
  is_custom: boolean;
  main_course_type: string;
  notes: string;
  other_selections: string[];
  plated_starter: string;
  starter_type: string;
  updated_at: string;
  traditional_dessert: string;
  dessert_canapes: string[];
  individual_cakes: string[];
  karoo_meat_selection: string;
  karoo_starch_selection: string[];
  karoo_vegetable_selections: string[];
  karoo_salad_selection: string;
  plated_main_selection: string;
  plated_salad_selection: string;
}