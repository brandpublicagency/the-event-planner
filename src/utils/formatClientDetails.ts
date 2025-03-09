
import type { Event } from "@/types/event";

export const formatClientDetails = (event: Event): string => {
  if (event.event_type === 'Wedding') {
    // For wedding events, show bride and groom details
    let details = `${event.primary_name || 'Bride not specified'}`;
    if (event.primary_email) details += ` (${event.primary_email})`;
    if (event.primary_phone) details += ` - ${event.primary_phone}`;
    details += ` & ${event.secondary_name || 'Groom not specified'}`;
    if (event.secondary_email) details += ` (${event.secondary_email})`;
    
    return details;
  } else {
    // For corporate or other events
    let details = `${event.company || 'Company not specified'}`;
    if (event.primary_name) details += ` - ${event.primary_name}`;
    if (event.primary_email) details += ` (${event.primary_email})`;
    if (event.primary_phone) details += ` - ${event.primary_phone}`;
    if (event.vat_number) details += ` - VAT: ${event.vat_number}`;
    
    return details;
  }
};
