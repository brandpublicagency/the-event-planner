
import { supabase } from "@/integrations/supabase/client";
import { Contact, ContactUpdate } from "@/types/contact";
import { useToast } from "@/hooks/use-toast";

export const updateContact = async (contact: Contact, updates: ContactUpdate) => {
  try {
    // Since we're using email as the unique identifier, 
    // we need to update all events associated with this contact
    for (const event of contact.events) {
      // Determine if this is a primary or secondary contact
      const isPrimary = event.originalData.primary_email?.toLowerCase() === contact.email.toLowerCase();
      
      const updateData = isPrimary 
        ? {
            primary_name: updates.name || contact.name,
            primary_email: updates.email || contact.email,
            primary_phone: updates.phone || contact.phone,
            // Only update company-wide fields if this is a primary contact
            company: updates.company || contact.company,
            address: updates.address || contact.address,
            vat_number: updates.vat_number || contact.vat_number,
          }
        : {
            secondary_name: updates.name || contact.name,
            secondary_email: updates.email || contact.email,
            secondary_phone: updates.phone || contact.phone,
          };
      
      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('event_code', event.eventCode);
      
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating contact:', error);
    throw new Error(`Failed to update contact: ${error.message}`);
  }
};

export const deleteContact = async (contact: Contact) => {
  // We won't actually delete the contact, just remove their association with events
  try {
    // For each event associated with this contact
    for (const event of contact.events) {
      // Determine if this is a primary or secondary contact
      const isPrimary = event.originalData.primary_email?.toLowerCase() === contact.email.toLowerCase();
      
      const updateData = isPrimary 
        ? {
            primary_name: null,
            primary_email: null,
            primary_phone: null,
          }
        : {
            secondary_name: null,
            secondary_email: null,
            secondary_phone: null,
          };
      
      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('event_code', event.eventCode);
      
      if (error) throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting contact:', error);
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
};
