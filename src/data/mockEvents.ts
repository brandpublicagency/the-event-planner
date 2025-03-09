
import { Event } from "@/types/event";

export const mockEvents: Event[] = [
  {
    event_code: "EVENT-280123-1",
    name: "Smith Wedding",
    description: "Elegant wedding celebration",
    event_type: "Wedding",
    event_date: "2023-07-15",
    start_time: "16:00",
    end_time: "23:00",
    pax: 120,
    client_address: "123 Main St, Cape Town",
    created_at: "2023-01-28T10:00:00Z",
    updated_at: "2023-01-28T10:00:00Z",
    created_by: "user123",
    completed: false,
    deleted_at: null,
    venues: ["The Gallery", "The Grand Hall"],
    
    // Related data
    wedding_details: {
      bride_name: "Emily Smith",
      bride_email: "emily@example.com",
      bride_mobile: "+27 82 123 4567",
      groom_name: "James Johnson",
      groom_email: "james@example.com",
      groom_mobile: "+27 83 765 4321"
    }
  },
  {
    event_code: "EVENT-050223-2",
    name: "Tech Conference 2023",
    description: "Annual technology conference",
    event_type: "Conference",
    event_date: "2023-09-10",
    start_time: "08:00",
    end_time: "17:00",
    pax: 250,
    client_address: "456 Business Park, Johannesburg",
    created_at: "2023-02-05T14:30:00Z",
    updated_at: "2023-02-05T14:30:00Z",
    created_by: "user456",
    completed: false,
    deleted_at: null,
    venues: ["The Kitchen", "Package 1"],
    
    // Related data
    corporate_details: {
      company_name: "TechCorp Innovations",
      contact_person: "Sarah Williams",
      contact_email: "sarah@techcorp.com",
      contact_mobile: "+27 84 111 2222",
      company_vat: "VAT123456789",
      company_address: "456 Business Park, Johannesburg"
    }
  }
];
