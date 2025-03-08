
import { supabase } from "@/integrations/supabase/client";
import type { Contact, ContactUpdate } from "@/types/contact";

export const updateContact = async (contact: Contact, updates: ContactUpdate): Promise<void> => {
  // Based on the contact type, update the appropriate record
  if (contact.contactType === 'corporate') {
    const { error } = await supabase
      .from('corporate_details')
      .update({
        contact_person: updates.name,
        contact_email: updates.email,
        contact_mobile: updates.phone,
        company_name: updates.company,
        company_address: updates.address,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-bride') {
    const { error } = await supabase
      .from('wedding_details')
      .update({
        bride_name: updates.name,
        bride_email: updates.email,
        bride_mobile: updates.phone,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-groom') {
    const { error } = await supabase
      .from('wedding_details')
      .update({
        groom_name: updates.name,
        groom_email: updates.email,
        groom_mobile: updates.phone,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  }
};

export const deleteContact = async (contact: Contact): Promise<void> => {
  // Based on the contact type, update the appropriate record to clear the contact
  if (contact.contactType === 'corporate') {
    const { error } = await supabase
      .from('corporate_details')
      .update({
        contact_person: null,
        contact_email: null,
        contact_mobile: null,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-bride') {
    const { error } = await supabase
      .from('wedding_details')
      .update({
        bride_name: null,
        bride_email: null,
        bride_mobile: null,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  } 
  else if (contact.contactType === 'wedding-groom') {
    const { error } = await supabase
      .from('wedding_details')
      .update({
        groom_name: null,
        groom_email: null,
        groom_mobile: null,
        updated_at: new Date().toISOString()
      })
      .eq('event_code', contact.eventCode);

    if (error) throw new Error(error.message);
  }
};
