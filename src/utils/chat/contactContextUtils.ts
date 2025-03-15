
/**
 * Prepares contacts context for AI
 */
export const prepareContactsContext = (contacts: any[] = []): string => {
  if (!contacts || contacts.length === 0) {
    return 'No contacts found.';
  }
  
  // Sort contacts by most recently updated
  const sortedContacts = [...contacts].sort((a, b) => {
    if (!a.updated_at) return 1;
    if (!b.updated_at) return -1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
  
  let contactsContext = `CONTACTS (${contacts.length} total):\n`;
  
  // Include the 10 most recently updated contacts
  sortedContacts.slice(0, 10).forEach((contact, index) => {
    const name = contact.full_name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
    const email = contact.email || 'No email';
    const phone = contact.phone || 'No phone';
    
    contactsContext += `${index + 1}. ${name} - ${email} - ${phone}${contact.company ? ` (${contact.company})` : ''}\n`;
  });
  
  if (sortedContacts.length > 10) {
    contactsContext += `... and ${sortedContacts.length - 10} more contacts.\n`;
  }
  
  return contactsContext;
};
