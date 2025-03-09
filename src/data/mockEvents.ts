
import { Event } from "@/types/event";

export const mockEvents: Event[] = [
  {
    event_code: "EVENT-0123",
    name: "Smith Wedding",
    description: "Wedding celebration for Sarah and John",
    event_type: "Wedding",
    event_date: "2023-11-15",
    start_time: "16:00:00",
    end_time: "23:00:00",
    pax: 120,
    client_address: "123 Main St, Anytown",
    created_at: "2023-10-01T10:00:00Z",
    updated_at: "2023-10-05T14:30:00Z",
    created_by: "user-123",
    completed: false,
    deleted_at: null,
    venues: ["The Kitchen", "The Gallery"],
    
    // New contact fields
    primary_name: "Sarah Smith",
    primary_phone: "555-123-4567",
    primary_email: "sarah@example.com",
    secondary_name: "John Wilson",
    secondary_phone: "555-987-6543",
    secondary_email: "john@example.com",
    address: "123 Main St, Anytown",
    company: null,
    vat_number: null,
    
    // Legacy related data
    wedding_details: {
      bride_name: "Sarah Smith",
      bride_email: "sarah@example.com",
      bride_mobile: "555-123-4567",
      groom_name: "John Wilson",
      groom_email: "john@example.com",
      groom_mobile: "555-987-6543"
    }
  },
  {
    event_code: "EVENT-0456",
    name: "Tech Corp Annual Conference",
    description: "Annual tech conference with keynote speakers",
    event_type: "Corporate Event",
    event_date: "2023-12-05",
    start_time: "09:00:00",
    end_time: "18:00:00",
    pax: 250,
    client_address: "456 Corporate Blvd, Business City",
    created_at: "2023-10-15T11:00:00Z",
    updated_at: "2023-10-20T09:45:00Z",
    created_by: "user-456",
    completed: false,
    deleted_at: null,
    venues: ["The Grand Hall"],
    
    // New contact fields
    primary_name: "Jane Doe",
    primary_phone: "555-555-1234",
    primary_email: "jane@techcorp.com",
    secondary_name: null,
    secondary_phone: null,
    secondary_email: null,
    address: "456 Corporate Blvd, Business City",
    company: "Tech Corp Inc.",
    vat_number: "TC-VAT-12345",
    
    // Legacy related data
    corporate_details: {
      company_name: "Tech Corp Inc.",
      contact_person: "Jane Doe",
      contact_email: "jane@techcorp.com",
      contact_mobile: "555-555-1234",
      company_vat: "TC-VAT-12345",
      company_address: "456 Corporate Blvd, Business City"
    }
  }
];
