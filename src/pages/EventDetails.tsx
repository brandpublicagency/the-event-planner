import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import WeddingMenuPlanner from "@/components/WeddingMenuPlanner";

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

  const handlePrint = () => {
    window.print();
  };

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
    <>
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-zinc-200 p-6 print:border-none print:shadow-none print:p-0">
          <div className="flex justify-between items-center mb-8 print:hidden">
            <div /> {/* Empty div for spacing */}
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
            <span className="text-sm px-2 py-0.5 bg-zinc-50 border border-zinc-200 rounded-md text-zinc-600">
              {event.event_code}
            </span>
          </div>

          <div className="text-lg text-zinc-600">
            <span className="font-semibold">{event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'No date'}</span> / {event.event_type} / <span className="font-semibold">{event.pax} Pax</span> / {event.venues?.map((v: any) => v.name).join(' + ')}
          </div>

          <WeddingMenuPlanner eventCode={event.event_code} />
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          
          body {
            background: white !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default EventDetails;