
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
            primary_name,
            primary_email,
            primary_phone,
            secondary_name,
            secondary_email,
            secondary_phone,
            company,
            address,
            vat_number,
            venues,
            completed
          `)
          .is('deleted_at', null)
          .order('updated_at', { ascending: false });

        if (eventsError) throw eventsError;
        
        // Use a Map to store unique contacts by email
        const contactsMap = new Map();
        
        events?.forEach(event => {
          // Process primary contact if it exists
          if (event.primary_name && event.primary_email) {
            const email = event.primary_email.toLowerCase().trim();
            if (!contactsMap.has(email)) {
              // Create new contact if email is not in map
              contactsMap.set(email, {
                id: `contact-${email}`,
                name: event.primary_name,
                email: email,
                phone: event.primary_phone || '',
                company: event.company || null,
                vat_number: event.vat_number || null,
                address: event.address || null,
                contactType: event.event_type === 'Wedding' ? 'wedding-bride' : 'corporate',
                events: [], // Initialize events array
              });
            }
            
            // Add this event to the contact's events array
            const contact = contactsMap.get(email);
            contact.events.push({
              eventCode: event.event_code,
              eventName: event.name,
              eventDate: event.event_date,
              eventType: event.event_type,
              completed: event.completed || false,
              venue: Array.isArray(event.venues) && event.venues.length > 0 ? event.venues[0] : 'Not specified',
              originalData: event
            });
          }

          // Process secondary contact if it exists
          if (event.secondary_name && event.secondary_email) {
            const email = event.secondary_email.toLowerCase().trim();
            if (!contactsMap.has(email)) {
              // Create new contact if email is not in map
              contactsMap.set(email, {
                id: `contact-${email}`,
                name: event.secondary_name,
                email: email,
                phone: event.secondary_phone || '',
                company: event.company || null,
                vat_number: event.vat_number || null,
                address: event.address || null,
                contactType: 'wedding-groom', // Assuming secondary is always the groom in weddings
                events: [], // Initialize events array
              });
            }
            
            // Add this event to the contact's events array
            const contact = contactsMap.get(email);
            contact.events.push({
              eventCode: event.event_code,
              eventName: event.name,
              eventDate: event.event_date,
              eventType: event.event_type,
              completed: event.completed || false,
              venue: Array.isArray(event.venues) && event.venues.length > 0 ? event.venues[0] : 'Not specified',
              originalData: event
            });
          }
        });

        // Convert Map to array
        const uniqueContacts = Array.from(contactsMap.values());
        
        // Sort contacts alphabetically by name (A to Z)
        return uniqueContacts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      } catch (error: any) {
        console.error('Error fetching contacts:', error);
        toast({
          title: "Error fetching contacts",
          description: "Failed to load contacts data",
          variant: "destructive",
        });
        return [];
      }
    },
  });
};
