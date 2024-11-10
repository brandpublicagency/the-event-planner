export type Events = {
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
};