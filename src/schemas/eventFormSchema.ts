
import * as z from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  event_type: z.enum([
    "Wedding", 
    "Conference", 
    "Year-End Function", 
    "Corporate Function", 
    "Babyshower or Kitchen Tea", 
    "Celebration or other Party", 
    "Concert or Performance", 
    "Private Event", 
    "Other Event"
  ]),
  event_date: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  pax: z.number().optional().nullable(),
  venues: z.array(z.string()).optional().default([]),
  
  // New unified contact fields
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
