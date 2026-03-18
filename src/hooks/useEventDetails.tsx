
import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types/event";

export function useEventDetails() {
  const { id } = useParams();
  const location = useLocation();

  // Normalize the event ID for database queries
  const normalizedId = id || null;

  // Check if this is a forced refresh or returning from edit
  const shouldRefetch = (() => {
    const searchParams = new URLSearchParams(location.search);
    const forceRefresh = searchParams.get('refresh');
    const fromEdit = searchParams.get('from') === 'edit';
    return forceRefresh === 'true' || fromEdit;
  })();

  // Fetch event data
  const { 
    data: event, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['event', normalizedId],
    queryFn: async () => {
      if (!normalizedId) return null;
      try {
        // First attempt: try exact match on event_code
        let { data, error } = await supabase
          .from("events")
          .select("*")
          .eq('event_code', normalizedId)
          .single();

        if (error || !data) {
          // Second attempt: try with EVENT- prefix
          const prefixedId = normalizedId.startsWith('EVENT-') ? normalizedId : `EVENT-${normalizedId}`;
          
          ({ data, error } = await supabase
            .from("events")
            .select("*")
            .eq('event_code', prefixedId)
            .single());
            
          if (error || !data) {
            // Third attempt: if prefixed ID contains dashes, try without EVENT- prefix
            if (normalizedId.includes('-') && normalizedId.startsWith('EVENT-')) {
              const unprefixedId = normalizedId.replace('EVENT-', '');
              ({ data, error } = await supabase
                .from("events")
                .select("*")
                .eq('event_code', unprefixedId)
                .single());
            }
          }
        }

        if (error) {
          console.error("Error fetching event:", error);
          throw error;
        }

        if (!data) {
          throw new Error(`Event not found`);
        }
        return data as Event;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 0 // Set to 0 to ensure fresh data on each visit
  });

  // Trigger a refetch if coming from edit or with refresh parameter
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
    }
  }, [location.search, refetch, shouldRefetch]);

  // Format the event date
  const formattedDate = event?.event_date 
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Date not set';

  return {
    event,
    eventId: normalizedId,
    isLoading,
    isError,
    error,
    refetch,
    formattedDate
  };
}
