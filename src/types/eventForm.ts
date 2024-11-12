export interface EventFormData {
  name: string;
  description?: string;
  event_type: 'Wedding' | 'Corporate Event' | 'Celebration' | 'Conference' | 'Other';
  event_date?: string;
  pax?: number;
  package_id?: string;
  client_address?: string;
  venues: Record<string, boolean>;
  // Wedding specific fields
  bride_name?: string;
  bride_email?: string;
  bride_mobile?: string;
  groom_name?: string;
  groom_email?: string;
  groom_mobile?: string;
  // Corporate specific fields
  company_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_mobile?: string;
  company_vat?: string;
  company_address?: string;
}