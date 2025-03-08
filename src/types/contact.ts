
// Define the Contact interface for the consolidated contacts view
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  contactType: 'wedding-bride' | 'wedding-groom' | 'corporate';
  eventCode: string;
  eventName: string;
  eventDate: string | null;
  venue: string;
  originalData: any; // The original wedding_details or corporate_details record
}

export interface ContactUpdate {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}
