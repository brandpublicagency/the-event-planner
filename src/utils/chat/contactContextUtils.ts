
import { format } from "date-fns";

/**
 * Prepares contacts context data for the AI assistant
 */
export function prepareContactsContext(contacts: any[]) {
  if (!contacts || contacts.length === 0) {
    return "No contacts found.";
  }
  
  return contacts.map(contact => {
    return `Contact: ${JSON.stringify({
      id: contact.id,
      name: contact.full_name || 'Unknown',
      email: contact.email || 'No email',
      phone: contact.mobile || 'No phone',
      surname: contact.surname || 'No surname'
    }, null, 2)}`;
  }).join('\n\n');
}
