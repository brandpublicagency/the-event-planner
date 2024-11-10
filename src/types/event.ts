export interface Event {
  event_code: string;
  title: string;
  description: string;
  progress: number;
  teamSize: number;
  dueDate: string;
  status: 'Confirmed' | 'Tentative' | 'Cancelled';
  event_type: string;
  pax?: number;
  venues: { name: string }[];
  bride_name?: string;
  bride_mobile?: string;
  bride_email?: string;
  groom_name?: string;
  groom_mobile?: string;
  groom_email?: string;
  client_address?: string;
}