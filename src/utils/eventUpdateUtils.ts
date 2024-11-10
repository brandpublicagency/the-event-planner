import { supabase } from "@/integrations/supabase/client";

export const updateEvent = async (eventCode: string, data: any) => {
  // Start a transaction by using multiple operations
  const eventUpdate = {
    name: data.name,
    event_type: data.event_type,
    event_date: data.event_date,
    pax: data.pax,
    package_id: data.package_id,
    client_address: data.client_address,
  };

  // Update main event details
  const { error: eventError } = await supabase
    .from('events')
    .update(eventUpdate)
    .eq('event_code', eventCode);

  if (eventError) throw eventError;

  // Handle venue relationships
  if (data.venues) {
    // First, delete existing venue relationships
    const { error: deleteError } = await supabase
      .from('event_venues')
      .delete()
      .eq('event_code', eventCode);

    if (deleteError) throw deleteError;

    // Then insert new venue relationships
    const selectedVenues = Object.entries(data.venues)
      .filter(([_, selected]) => selected)
      .map(([venueId]) => ({
        event_code: eventCode,
        venue_id: venueId,
      }));

    if (selectedVenues.length > 0) {
      const { error: venuesError } = await supabase
        .from('event_venues')
        .insert(selectedVenues);

      if (venuesError) throw venuesError;
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
};