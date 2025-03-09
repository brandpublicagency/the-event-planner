
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
  client_address: string | null;
  venues?: string[];
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
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        pax: data.pax || null,
        client_address: data.client_address || null,
        venues: data.venues || null,
      })
      .eq('event_code', eventCode);

    if (eventError) throw eventError;

    // Update event type specific details
    if (data.event_type === 'Wedding') {
      const { error: weddingError } = await supabase
        .from('wedding_details')
        .upsert({
          event_code: eventCode,
          bride_name: data.bride_name || null,
          bride_email: data.bride_email || null,
          bride_mobile: data.bride_mobile || null,
          groom_name: data.groom_name || null,
          groom_email: data.groom_email || null,
          groom_mobile: data.groom_mobile || null,
        });

      if (weddingError) throw weddingError;
    } else {
      const { error: corporateError } = await supabase
        .from('corporate_details')
        .upsert({
          event_code: eventCode,
          company_name: data.company_name || null,
          contact_person: data.contact_person || null,
          contact_email: data.contact_email || null,
          contact_mobile: data.contact_mobile || null,
          company_vat: data.company_vat || null,
          company_address: data.company_address || null,
        });

      if (corporateError) throw corporateError;
    }

    // Invalidate queries
    await queryClient.invalidateQueries({ queryKey: ['events'] });
    await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating event:', error);
    throw error;
  }
};
