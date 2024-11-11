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

  const { data: event, isLoading } = useQuery({
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
        .single();

      if (error) throw error;
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

  if (!event) return (
    <div className="flex-1 p-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Event not found</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Event Details</h2>
        <p className="text-muted-foreground">View and manage event information</p>
      </div>

      <Card className="rounded-xl border border-zinc-200 bg-white">
        <CardContent className="p-0">
          <div className="group">
            <div className="flex items-center px-4 py-3">
              <div className="flex items-center flex-1">
                <div className="flex flex-col gap-2.5 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-xs px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-600">
                        {event.event_code}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date'}
                      </span>
                    </div>
                  </div>
                  <div className="pl-[30px] space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-medium leading-none">{event.name}</h4>
                      <Badge variant="outline" className="text-xs font-normal border border-zinc-200 bg-zinc-50 rounded-md">
                        {event.event_type} / {event.pax} Pax / {event.venues?.map((v: any) => v.name).join(' + ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;