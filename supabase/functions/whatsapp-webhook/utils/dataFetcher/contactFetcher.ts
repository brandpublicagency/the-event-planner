
import { supabase, handleDbError } from './index.ts';
import { withTimeout } from '../timeoutUtils.ts';

export const fetchContacts = async () => {
  console.log('Fetching contacts data');
  
  try {
    const { data: contacts, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*'),
      'fetchContacts',
      10000
    );
    
    if (error) {
      handleDbError('fetchContacts', error);
    }
    
    console.log(`Successfully fetched ${contacts?.length || 0} contacts`);
    return contacts || [];
  } catch (error) {
    console.error('Error in fetchContacts:', error);
    return [];
  }
};

// Add specific contact fetching function
export const fetchContactById = async (contactId: string) => {
  console.log(`Fetching contact with ID: ${contactId}`);
  
  try {
    const { data: contact, error } = await withTimeout(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', contactId)
        .maybeSingle(),
      'fetchContactById',
      8000
    );
    
    if (error) {
      handleDbError(`fetchContactById for ${contactId}`, error);
    }
    
    return contact;
  } catch (error) {
    console.error(`Error in fetchContactById for ${contactId}:`, error);
    return null;
  }
};
