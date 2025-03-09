
// Define the Contact interface for the consolidated contacts view
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  vat_number?: string | null;
  contactType: 'wedding-bride' | 'wedding-groom' | 'corporate';
  eventCode: string;
  eventName: string;
  eventDate: string | null;
  venue: string;
  address: string | null;
  originalData: any; // The original event record
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  vat_number?: string;
}
