
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Contact } from "@/types/contact";

export const useContactsQuery = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      try {
        // Fetch all events with contact information
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select(`
            event_code,
            name,
            event_type,
            event_date,
            client_address,
            primary_name,
            primary_email,
            primary_phone,
            secondary_name,
            secondary_email,
            secondary_phone,
            company,
            address,
            vat_number,
            venues
          `)
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });

        if (eventsError) throw eventsError;
        
        const processedContacts: Contact[] = [];
        
        events?.forEach(event => {
          // Add primary contact if it exists
          if (event.primary_name) {
            processedContacts.push({
              id: `primary-${event.event_code}`,
              name: event.primary_name,
              email: event.primary_email || '',
              phone: event.primary_phone || '',
              company: event.company || null,
              address: event.address || event.client_address || null,
              contactType: event.event_type === 'Wedding' ? 'wedding-bride' : 'corporate',
              eventCode: event.event_code,
              eventName: event.name,
              eventDate: event.event_date,
              venue: Array.isArray(event.venues) && event.venues.length > 0 ? event.venues[0] : 'Not specified',
              originalData: event
            });
          }

          // Add secondary contact if it exists (usually for wedding events)
          if (event.secondary_name) {
            processedContacts.push({
              id: `secondary-${event.event_code}`,
              name: event.secondary_name,
              email: event.secondary_email || '',
              phone: event.secondary_phone || '',
              company: event.company || null,
              address: event.address || event.client_address || null,
              contactType: 'wedding-groom', // Assuming secondary is always the groom in weddings
              eventCode: event.event_code,
              eventName: event.name,
              eventDate: event.event_date,
              venue: Array.isArray(event.venues) && event.venues.length > 0 ? event.venues[0] : 'Not specified',
              originalData: event
            });
          }
        });

        // Sort by date (newest first)
        return processedContacts.sort((a, b) => {
          if (!a.eventDate && !b.eventDate) return 0;
          if (!a.eventDate) return 1;
          if (!b.eventDate) return -1;
          return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        });
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error",
          description: "Failed to fetch contacts",
          variant: "destructive",
        });
        return [];
      }
    },
  });
};
