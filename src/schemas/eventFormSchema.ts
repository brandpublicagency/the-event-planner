
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
  event_date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  pax: z.number().optional().nullable(),
  venues: z.array(z.string()).optional().default([]),
  
  // New unified contact fields
  primary_name: z.string().optional().nullable(),
  primary_phone: z.string().optional().nullable(),
  primary_email: z.string().email("Invalid email format").optional().nullable(),
  secondary_name: z.string().optional().nullable(),
  secondary_phone: z.string().optional().nullable(),
  secondary_email: z.string().email("Invalid email format").optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  vat_number: z.string().optional().nullable(),
  
  // Legacy fields (kept for backward compatibility)
  bride_name: z.string().optional().nullable(),
  bride_email: z.string().email("Invalid email format").optional().nullable(),
  bride_mobile: z.string().optional().nullable(),
  groom_name: z.string().optional().nullable(),
  groom_email: z.string().email("Invalid email format").optional().nullable(),
  groom_mobile: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  contact_person: z.string().optional().nullable(),
  contact_email: z.string().email("Invalid email format").optional().nullable(),
  contact_mobile: z.string().optional().nullable(),
  company_vat: z.string().optional().nullable(),
  company_address: z.string().optional().nullable(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
