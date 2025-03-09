
import { supabase } from "@/integrations/supabase/client";
import type { Contact, ContactUpdate } from "@/types/contact";

export const updateContact = async (contact: Contact, updates: ContactUpdate): Promise<void> => {
  // Based on the contact type, update the appropriate fields in the events table
  if (contact.contactType === 'corporate' || contact.contactType === 'wedding-bride') {
    // Primary contact (either corporate contact or bride)
    const { error } = await supabase
      .from('events')
      .update({
        primary_name: updates.name,
        primary_email: updates.email,
        primary_phone: updates.phone,
        company: updates.company,
        address: updates.address,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-groom') {
    // Secondary contact (groom)
    const { error } = await supabase
      .from('events')
      .update({
        secondary_name: updates.name,
        secondary_email: updates.email,
        secondary_phone: updates.phone,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  }
};

export const deleteContact = async (contact: Contact): Promise<void> => {
  // Based on the contact type, update the appropriate record to clear the contact
  if (contact.contactType === 'corporate' || contact.contactType === 'wedding-bride') {
    // Primary contact (either corporate contact or bride)
    const { error } = await supabase
      .from('events')
      .update({
        primary_name: null,
        primary_email: null,
        primary_phone: null,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-groom') {
    // Secondary contact (groom)
    const { error } = await supabase
      .from('events')
      .update({
        secondary_name: null,
        secondary_email: null,
        secondary_phone: null,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  }
};
