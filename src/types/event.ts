
export interface Event {
  // Database fields
  event_code: string;
  name: string;
  description: string | null;
  event_type: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  pax: number | null;
  client_address: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  completed: boolean;
  deleted_at: string | null;
  venues: string[] | null;
  
  // New contact fields
  primary_name: string | null;
  primary_phone: string | null;
  primary_email: string | null;
  secondary_name: string | null;
  secondary_phone: string | null;
  secondary_email: string | null;
  address: string | null;
  company: string | null;
  vat_number: string | null;
  
  // Related tables (kept for backward compatibility)
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

export interface EventCreate {
  event_code: string;
  name: string;
  description?: string | null;
  event_type: string;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  pax?: number | null;
  client_address?: string | null;
  created_by?: string | null;
  completed?: boolean;
  venues?: string[] | null;
  
  // New contact fields
  primary_name?: string | null;
  primary_phone?: string | null;
  primary_email?: string | null;
  secondary_name?: string | null;
  secondary_phone?: string | null;
  secondary_email?: string | null;
  address?: string | null;
  company?: string | null;
  vat_number?: string | null;
}
