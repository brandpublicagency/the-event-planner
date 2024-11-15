import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EditEventForm } from "@/components/forms/EditEventForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
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
          ),
          wedding_details (*),
          corporate_details (*),
          menu_selections (*)
        `)
        .eq('event_code', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      if (!data) throw new Error('Event not found');
      return data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load event details. Please try again later.'}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 -ml-2 text-zinc-600 hover:text-zinc-900"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Event</h1>
            <p className="text-sm text-zinc-500">
              Update the details for event {event?.event_code}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm">
          <div className="p-6">
            {event && <EditEventForm event={event} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;