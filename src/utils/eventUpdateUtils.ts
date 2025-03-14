
import { supabase } from "@/integrations/supabase/client";
import { queryClient } from "@/lib/react-query";

interface EventUpdateData {
  name: string;
  description: string;
  event_type: string;
  event_date: string | null;
  start_time?: string | null;
  end_time?: string | null;
  pax: number | null;
  venues?: string[];
  completed?: boolean;
  
  // Contact fields
  primary_name?: string;
  primary_phone?: string;
  primary_email?: string;
  secondary_name?: string;
  secondary_phone?: string;
  secondary_email?: string;
  address?: string;
  company?: string;
  vat_number?: string;
  
  // Legacy fields (kept for backward compatibility)
  // Wedding specific fields
  bride_name?: string;
  bride_email?: string;
  bride_mobile?: string;
  groom_name?: string;
  groom_email?: string;
  groom_mobile?: string;
  // Corporate specific fields
  company_name?: string;
  contact_person?: string;
  contact_email?: string;
  contact_mobile?: string;
  company_vat?: string;
  company_address?: string;
}

// These values MUST match exactly what's expected in the database trigger
const ALLOWED_VENUES = [
  "The Kitchen",
  "The Gallery",
  "The Grand Hall",
  "The Lawn",
  "The Avenue",
  "Package 1",
  "Package 2",
  "Package 3"
];

export const updateEvent = async (eventCode: string, data: EventUpdateData) => {
  try {
    console.log("Updating event with venues:", data.venues);
    
    // Validate that venues are in the allowed list
    if (data.venues && data.venues.length > 0) {
      // Filter out any invalid venues
      const validVenues = data.venues.filter(venue => ALLOWED_VENUES.includes(venue));
      
      if (validVenues.length !== data.venues.length) {
        console.warn("Some venues were filtered out because they were not in the allowed list");
        // Replace data.venues with only the valid ones
        data.venues = validVenues;
      }
      
      if (validVenues.length === 0) {
        console.error("No valid venues provided");
        throw new Error("Invalid venue value. Allowed values are: The Kitchen, The Gallery, The Grand Hall, Package 1, Package 2, Package 3");
      }
    }

    // Map contact information from legacy fields to new fields if not provided directly
    if (data.event_type === 'Wedding') {
      // For Wedding events, map bride/groom details to primary/secondary contacts if not set
      if (!data.primary_name && data.bride_name) data.primary_name = data.bride_name;
      if (!data.primary_email && data.bride_email) data.primary_email = data.bride_email;
      if (!data.primary_phone && data.bride_mobile) data.primary_phone = data.bride_mobile;
      if (!data.secondary_name && data.groom_name) data.secondary_name = data.groom_name;
      if (!data.secondary_email && data.groom_email) data.secondary_email = data.groom_email;
      if (!data.secondary_phone && data.groom_mobile) data.secondary_phone = data.groom_mobile;
    } else {
      // For Corporate or Other events, map company details to primary contact if not set
      if (!data.primary_name && data.contact_person) data.primary_name = data.contact_person;
      if (!data.primary_email && data.contact_email) data.primary_email = data.contact_email;
      if (!data.primary_phone && data.contact_mobile) data.primary_phone = data.contact_mobile;
      if (!data.company && data.company_name) data.company = data.company_name;
      if (!data.vat_number && data.company_vat) data.vat_number = data.company_vat;
    }
    
    // If address is not provided but company_address is, use company_address
    if (!data.address && data.company_address) data.address = data.company_address;

    // Update main event details
    const { error: eventError } = await supabase
      .from('events')
      .update({
        name: data.name,
        description: data.description,
        event_type: data.event_type,
        event_date: data.event_date,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        pax: data.pax || null,
        venues: data.venues || null,
        completed: data.completed !== undefined ? data.completed : undefined,
        // Contact fields
        primary_name: data.primary_name || null,
        primary_phone: data.primary_phone || null,
        primary_email: data.primary_email || null,
        secondary_name: data.secondary_name || null,
        secondary_phone: data.secondary_phone || null,
        secondary_email: data.secondary_email || null,
        address: data.address || null,
        company: data.company || null,
        vat_number: data.vat_number || null,
      })
      .eq('event_code', eventCode);

    if (eventError) {
      console.error("Event update error:", eventError);
      throw eventError;
    }

    // Invalidate queries
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
    await queryClient.invalidateQueries({ queryKey: ['passed-events'] });
    await queryClient.invalidateQueries({ queryKey: ['events', eventCode] });
    await queryClient.invalidateQueries({ queryKey: ['contacts'] });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating event:', error);
    throw error;
  }
};
