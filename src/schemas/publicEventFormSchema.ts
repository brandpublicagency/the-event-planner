
import * as z from "zod";

// Define event type enum explicitly to avoid circular references
const EventTypeEnum = z.enum(["Wedding", "Corporate Event", "Celebration", "Conference", "Private Event", "Other"]);

export const publicEventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  event_type: EventTypeEnum,
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 21:00)").optional(),
  end_time: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in 24-hour format (e.g., 22:00)").optional(),
  pax: z.number().min(1, "Number of guests must be at least 1").optional(),
  venues: z.array(z.string()).min(1, "Please select at least one venue"),
  
  // Contact fields
  primary_name: z.string().min(1, "Name is required"),
  primary_phone: z.string().min(1, "Phone number is required"),
  primary_email: z.string().email("Invalid email format").min(1, "Email is required"),
  secondary_name: z.string().optional(),
  secondary_phone: z.string().optional(),
  secondary_email: z.string().email("Invalid email format").optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  vat_number: z.string().optional(),
});
