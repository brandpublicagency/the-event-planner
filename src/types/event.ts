export interface Event {
  // Database fields
  event_code: string;
  name: string;
  description: string | null;
  event_type: string;
  event_date: string | null;
  pax: number | null;
  package_id: string | null;
  client_address: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  
  // Related tables
  event_venues?: {
    venues: {
      name: string;
    };
  }[];
  
  wedding_details?: {
    bride_name: string | null;
    bride_email: string | null;
    bride_mobile: string | null;
    groom_name: string | null;
    groom_email: string | null;
    groom_mobile: string | null;
  };
  
  corporate_details?: {
    company_name: string | null;
    contact_person: string | null;
    contact_email: string | null;
    contact_mobile: string | null;
    company_vat: string | null;
    company_address: string | null;
  };
  
  menu_selections?: {
    is_custom: boolean | null;
    custom_menu_details: string | null;
    starter_type: string | null;
    canape_package: string | null;
    canape_selections: string[] | null;
    plated_starter: string | null;
    notes: string | null;
  };
}