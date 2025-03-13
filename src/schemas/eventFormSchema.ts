
import * as z from "zod";

export const eventFormSchema = z.object({
  // Required fields
  name: z.string().min(1, "Event name is required"),
  event_type: z.enum(["Wedding", "Corporate Event", "Celebration", "Conference", "Private Event", "Other"]),
  venues: z.array(z.string()),
  
  // Optional fields
  description: z.string().optional(),
  event_date: z.string().optional(),
  start_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 21:00)").optional(),
  end_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 22:00)").optional(),
  pax: z.number().min(1, "Number of guests must be at least 1").optional().nullable(),
  
  // Contact fields
  primary_name: z.string().optional(),
  primary_phone: z.string().optional(),
  primary_email: z.string().email("Invalid email format").optional(),
  secondary_name: z.string().optional(),
  secondary_phone: z.string().optional(),
  secondary_email: z.string().email("Invalid email format").optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  vat_number: z.string().optional(),
  
  // Legacy fields (kept for backward compatibility)
  bride_name: z.string().optional(),
  bride_email: z.string().email("Invalid email format").optional(),
  bride_mobile: z.string().optional(),
  groom_name: z.string().optional(),
  groom_email: z.string().email("Invalid email format").optional(),
  groom_mobile: z.string().optional(),
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email("Invalid email format").optional(),
  contact_mobile: z.string().optional(),
  company_vat: z.string().optional(),
  company_address: z.string().optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
