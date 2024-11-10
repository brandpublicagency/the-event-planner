import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EditEventForm from "@/components/forms/EditEventForm";
import { updateEvent } from "@/utils/eventUpdateUtils";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          event_venues (
            venue_id,
            venues (
              id,
              name
            )
          ),
          wedding_details (*),
          corporate_details (*)
        `)
        .eq('event_code', id)
        .single();

      if (eventError) throw eventError;
      return eventData;
    },
  });

  React.useEffect(() => {
    if (event) {
      // Transform venues data for the form
      const venuesData = event.event_venues?.reduce((acc: any, ev: any) => {
        acc[ev.venue_id] = true;
        return acc;
      }, {});

      // Reset form with event data
      form.reset({
        ...event,
        ...event.wedding_details,
        ...event.corporate_details,
        venues: venuesData,
      });
    }
  }, [event, form]);

  const onSubmit = async (data: any) => {
    try {
      if (!id) throw new Error('Event ID is required');
      await updateEvent(id, data);

      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', id] });

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      navigate('/events');
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="h-8 px-2 lg:px-3"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Event</h2>
        </div>
      </div>

      <div className="max-w-5xl">
        <EditEventForm 
          form={form} 
          onSubmit={onSubmit}
          onCancel={() => navigate('/events')}
        />
      </div>
    </div>
  );
};

export default EditEvent;