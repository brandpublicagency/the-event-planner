import type { Event } from "@/types/event";

export const formatClientDetails = (event: Event) => {
  if (event.wedding_details) {
    return `Bride: ${event.wedding_details.bride_name || 'Not specified'}
Bride Contact: ${event.wedding_details.bride_email || 'Not specified'} / ${event.wedding_details.bride_mobile || 'Not specified'}
Groom: ${event.wedding_details.groom_name || 'Not specified'}
Groom Contact: ${event.wedding_details.groom_email || 'Not specified'} / ${event.wedding_details.groom_mobile || 'Not specified'}`;
  }
  
  if (event.corporate_details) {
    return `Company: ${event.corporate_details.company_name || 'Not specified'}
Contact Person: ${event.corporate_details.contact_person || 'Not specified'}
Contact: ${event.corporate_details.contact_email || 'Not specified'} / ${event.corporate_details.contact_mobile || 'Not specified'}
VAT: ${event.corporate_details.company_vat || 'Not specified'}`;
  }

  return 'No client details available';
};