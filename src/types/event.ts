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
  venues?: { name: string }[];
  
  // UI specific fields
  title?: string;
  progress?: number;
  teamSize?: number;
  dueDate?: string;
  status?: 'Confirmed' | 'Tentative' | 'Cancelled';
  
  // Wedding specific fields (optional)
  bride_name?: string;
  bride_email?: string;
  bride_mobile?: string;
  groom_name?: string;
  groom_email?: string;
  groom_mobile?: string;
}