import { Event } from '@/types/event';

export const mockEvents: Event[] = [
  {
    event_code: "EVENT-0101",
    name: "Sample Wedding",
    description: "Wedding Event",
    event_type: "Wedding",
    event_date: "2024-01-01",
    pax: 100,
    package_id: null,
    client_address: "123 Sample St",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    event_venues: [{ venues: { name: "The Gallery" } }],
    wedding_details: {
      bride_name: "Jane",
      bride_mobile: "1234567890",
      bride_email: "jane@example.com",
      groom_name: "John",
      groom_mobile: "0987654321",
      groom_email: "john@example.com"
    }
  },
  {
    event_code: "EVENT-0102",
    name: "Corporate Event",
    description: "Annual Meeting",
    event_type: "Corporate",
    event_date: "2024-01-15",
    pax: 50,
    package_id: null,
    client_address: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    event_venues: [{ venues: { name: "The Grand Hall" } }]
  }
];