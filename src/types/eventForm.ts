
export interface EventFormData {
  name: string; // Required field
  description?: string;
  event_type: "Wedding" | "Conference" | "Year-End Function" | "Corporate Function" | 
              "Babyshower or Kitchen Tea" | "Celebration or other Party" | 
              "Concert or Performance" | "Private Event" | "Other Event";
  event_date?: string;
  start_time?: string;
  end_time?: string;
  pax?: number;
  venues: string[];
  
  // Contact fields
  primary_name?: string;
  primary_phone?: string;
  primary_email?: string;
  secondary_name?: string;
  secondary_phone?: string;
  secondary_email?: string;
  address?: string;
  company?: string;
  vat_number?: string;
  
  // Legacy fields (for backward compatibility)
  bride_name?: string;
  bride_email?: string;
  bride_mobile?: string;
  groom_name?: string;
  groom_email?: string;
  groom_mobile?: string;
  company_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_mobile?: string;
  company_vat?: string;
  company_address?: string;
}
