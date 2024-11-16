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
import { EventFormData } from "@/types/eventForm";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<EventFormData>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
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
      if (!eventData) throw new Error('Event not found');
      return eventData;
    },
    enabled: !!id,
  });

  React.useEffect(() => {
    if (event) {
      // Transform venues data for the form
      const venuesData = event.event_venues?.reduce((acc: Record<string, boolean>, ev: any) => {
        if (ev.venues?.id) {
          acc[ev.venues.id] = true;
        }
        return acc;
      }, {});

      // Reset form with event data
      form.reset({
        name: event.name,
        description: event.description,
        event_type: event.event_type,
        event_date: event.event_date,
        start_time: event.start_time,
        end_time: event.end_time,
        pax: event.pax,
        package_id: event.package_id,
        client_address: event.client_address,
        venues: venuesData || {},
        // Wedding details
        bride_name: event.wedding_details?.bride_name,
        bride_email: event.wedding_details?.bride_email,
        bride_mobile: event.wedding_details?.bride_mobile,
        groom_name: event.wedding_details?.groom_name,
        groom_email: event.wedding_details?.groom_email,
        groom_mobile: event.wedding_details?.groom_mobile,
        // Corporate details
        company_name: event.corporate_details?.company_name,
        contact_person: event.corporate_details?.contact_person,
        contact_email: event.corporate_details?.contact_email,
        contact_mobile: event.corporate_details?.contact_mobile,
        company_vat: event.corporate_details?.company_vat,
        company_address: event.corporate_details?.company_address,
      });
    }
  }, [event, form]);

  const onSubmit = async (data: EventFormData) => {
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

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load event details",
      variant: "destructive",
    });
    navigate('/events');
    return null;
  }

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