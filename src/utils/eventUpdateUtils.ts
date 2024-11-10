import { supabase } from "@/integrations/supabase/client";
import { queryClient } from "@/lib/react-query";

interface EventUpdateData {
  name: string;
  description: string;
  event_type: string;
  event_date: string;
  pax: number;
  package_id: string;
  client_address: string;
  venues?: Record<string, boolean>;
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

export const updateEvent = async (eventCode: string, data: EventUpdateData) => {
  try {
    // Update main event details
    const { error: eventError } = await supabase
      .from('events')
      .update({
        name: data.name,
        description: data.description,
        event_type: data.event_type,
        event_date: data.event_date,
        pax: data.pax,
        package_id: data.package_id,
        client_address: data.client_address,
      })
      .eq('event_code', eventCode);

    if (eventError) throw eventError;

    // Update venue relationships
    if (data.venues) {
      // Delete existing venue relationships
      const { error: deleteError } = await supabase
        .from('event_venues')
        .delete()
        .eq('event_code', eventCode);

      if (deleteError) throw deleteError;

      // Insert new venue relationships
      const selectedVenues = Object.entries(data.venues)
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_code: eventCode,
          venue_id: venueId,
        }));

      if (selectedVenues.length > 0) {
        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(selectedVenues);

        if (venueError) throw venueError;
      }
    }

    // Update event type specific details
    if (data.event_type === 'Wedding') {
      const { error: weddingError } = await supabase
        .from('wedding_details')
        .upsert({
          event_code: eventCode,
          bride_name: data.bride_name,
          bride_email: data.bride_email,
          bride_mobile: data.bride_mobile,
          groom_name: data.groom_name,
          groom_email: data.groom_email,
          groom_mobile: data.groom_mobile,
        });

      if (weddingError) throw weddingError;
    } else {
      const { error: corporateError } = await supabase
        .from('corporate_details')
        .upsert({
          event_code: eventCode,
          company_name: data.company_name,
          contact_person: data.contact_person,
          contact_email: data.contact_email,
          contact_mobile: data.contact_mobile,
          company_vat: data.company_vat,
          company_address: data.company_address,
        });

      if (corporateError) throw corporateError;
    }

    // Invalidate both events and upcoming_events queries
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating event:', error);
    throw error;
  }
};