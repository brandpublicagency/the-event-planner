import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetails = () => {
  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venues (
              id,
              name
            )
          )
        `)
        .eq('event_code', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Event not found');
      
      return {
        ...data,
        venues: data.event_venues?.map((ev: any) => ev.venues) || []
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !event) return (
    <div className="flex-1 p-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Event not found</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
        <span className="text-sm px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-600">
          {event.event_code}
        </span>
      </div>

      <Card className="rounded-xl border border-zinc-200 bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="text-base">
              {event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date'} / {event.event_type} / {event.pax} Pax / {event.venues?.map((v: any) => v.name).join(' + ')}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;