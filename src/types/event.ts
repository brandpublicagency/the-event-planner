
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
  created_at: string;
  updated_at: string;
  created_by: string | null;
  completed: boolean;
  deleted_at: string | null;
  venues: string[] | null;
  
  // Contact fields
  primary_name: string | null;
  primary_phone: string | null;
  primary_email: string | null;
  secondary_name: string | null;
  secondary_phone: string | null;
  secondary_email: string | null;
  address: string | null;
  company: string | null;
  vat_number: string | null;
  
  // Additional properties from joins that might be present
  event_venues?: {
    venues?: {
      name: string;
    };
  }[];
  
  menu_selections?: {
    is_custom: boolean | null;
    starter_type: string | null;
    main_course_type: string | null;
    dessert_type: string | null;
  };
  
  wedding_details?: {
    bride_name: string | null;
    groom_name: string | null;
  };
  
  corporate_details?: {
    company_name: string | null;
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
  created_by?: string | null;
  completed?: boolean;
  venues?: string[] | null;
  client_address?: string | null; // Keep for backward compatibility with form
  
  // Contact fields
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
