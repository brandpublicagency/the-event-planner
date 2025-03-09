
import * as z from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  event_type: z.enum(["Wedding", "Corporate Event", "Celebration", "Conference", "Other"]),
  event_date: z.string().optional(),
  start_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 21:00)").optional(),
  end_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 22:00)").optional(),
  pax: z.number().min(1, "Number of guests must be at least 1").optional(),
  package_id: z.string().optional(),
  client_address: z.string().optional(),
  venues: z.array(z.string()),
  // Wedding specific fields
  bride_name: z.string().optional(),
  bride_email: z.string().email().optional(),
  bride_mobile: z.string().optional(),
  groom_name: z.string().optional(),
  groom_email: z.string().email().optional(),
  groom_mobile: z.string().optional(),
  // Corporate specific fields
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_mobile: z.string().optional(),
  company_vat: z.string().optional(),
  company_address: z.string().optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
