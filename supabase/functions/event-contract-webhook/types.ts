
/**
 * Type definitions for the event contract webhook
 */

/**
 * Field mappings type for normalizing form data
 */
export type FieldMappings = {
  [key: string]: string[];
};

/**
 * Normalized event data structure
 */
export interface NormalizedEventData {
  name: string;
  event_type: string;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  pax?: number | null;
  description?: string | null;
  venues?: string[] | null;
  event_notes?: string | null;
  primary_name?: string | null;
  primary_phone?: string | null;
  primary_email?: string | null;
  secondary_name?: string | null;
  secondary_phone?: string | null;
  secondary_email?: string | null;
  company?: string | null;
  address?: string | null;
  vat_number?: string | null;
}
