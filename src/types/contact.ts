
// Define the Contact interface for the consolidated contacts view
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  vat_number?: string | null;
  contactType: 'wedding-bride' | 'wedding-groom' | 'corporate';
  address: string | null;
  events: ContactEvent[];
}

export interface ContactEvent {
  eventCode: string;
  eventName: string;
  eventDate: string | null;
  eventType: string;
  completed: boolean;
  venue: string;
  originalData: any;
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  vat_number?: string;
}
