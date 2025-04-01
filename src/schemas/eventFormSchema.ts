
import * as z from "zod";

// Create a conditional schema for contact information
const createContactSchema = (eventType: string) => {
  const isWedding = eventType === "Wedding";
  
  // For weddings, secondary email should follow standard email validation
  // For non-weddings, secondary email should accept empty string or valid email
  const secondaryEmailSchema = isWedding
    ? z.string().email("Invalid email format").optional().nullable()
    : z.union([
        z.literal(''),
        z.string().email("Invalid email format")
      ]).optional().nullable();
  
  return {
    primary_name: z.string().optional().nullable(),
    primary_phone: z.string().optional().nullable(),
    primary_email: z.string().email("Invalid email format").optional().nullable(),
    secondary_name: z.string().optional().nullable(),
    secondary_phone: z.string().optional().nullable(),
    secondary_email: secondaryEmailSchema,
    address: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    vat_number: z.string().optional().nullable(),
  };
};

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
})
.passthrough() // Allow additional properties not specified in the schema
.superRefine((data, ctx) => {
  // Get the right contact schema based on event type
  const contactSchema = createContactSchema(data.event_type);
  
  // Validate the email fields specifically based on event type
  if (data.event_type === "Wedding") {
    // For weddings, do normal validation
    if (data.secondary_email && typeof data.secondary_email === 'string' && data.secondary_email.length > 0) {
      try {
        z.string().email().parse(data.secondary_email);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email format for Groom's Email",
          path: ["secondary_email"]
        });
      }
    }
  } else {
    // For non-weddings, secondary email is completely optional
    if (data.secondary_email === '') {
      // Empty string is valid for non-weddings
    } else if (data.secondary_email && typeof data.secondary_email === 'string' && data.secondary_email.length > 0) {
      try {
        z.string().email().parse(data.secondary_email);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid email format for Secondary Contact Email",
          path: ["secondary_email"]
        });
      }
    }
  }
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
