import { Event } from '@/types/event';

export const mockEvents: Event[] = [
  {
    event_code: "EVENT-0101",
    name: "Sample Wedding",
    title: "Sample Wedding",
    description: "Wedding Event",
    progress: 75,
    teamSize: 4,
    dueDate: "2024-01-01",
    event_date: "2024-01-01",
    status: "Confirmed",
    event_type: "Wedding",
    pax: 100,
    package_id: null,
    client_address: "123 Sample St",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    venues: [{ name: "The Gallery" }],
    bride_name: "Jane",
    bride_mobile: "1234567890",
    bride_email: "jane@example.com",
    groom_name: "John",
    groom_mobile: "0987654321",
    groom_email: "john@example.com"
  },
  {
    event_code: "EVENT-0102",
    name: "Corporate Event",
    title: "Corporate Event",
    description: "Annual Meeting",
    progress: 45,
    teamSize: 3,
    dueDate: "2024-01-15",
    event_date: "2024-01-15",
    status: "Tentative",
    event_type: "Corporate",
    pax: 50,
    package_id: null,
    client_address: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    venues: [{ name: "The Grand Hall" }]
  }
];