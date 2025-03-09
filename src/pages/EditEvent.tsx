
import React, { useEffect } from "react";
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
          wedding_details (*),
          corporate_details (*)
        `)
        .eq('event_code', id)
        .single();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');
      
      console.log("Fetched event data:", eventData);
      return eventData;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (event) {
      // Ensure event_type is one of the allowed values
      const eventType = event.event_type as EventFormData['event_type'];

      // Format times to HH:mm format if they exist
      const formatTime = (time: string | null) => {
        if (!time) return undefined;
        return time.slice(0, 5); // Take only HH:mm part
      };

      // Make sure venues is always an array
      const venues = Array.isArray(event.venues) ? event.venues : (event.venues ? [event.venues] : []);
      console.log("Initial venues from database:", venues);

      // Reset form with event data
      form.reset({
        name: event.name,
        description: event.description || '',
        event_type: eventType,
        event_date: event.event_date || undefined,
        start_time: formatTime(event.start_time),
        end_time: formatTime(event.end_time),
        pax: event.pax || undefined,
        client_address: event.client_address || '',
        venues: venues,
        // Wedding details
        bride_name: event.wedding_details?.bride_name || '',
        bride_email: event.wedding_details?.bride_email || '',
        bride_mobile: event.wedding_details?.bride_mobile || '',
        groom_name: event.wedding_details?.groom_name || '',
        groom_email: event.wedding_details?.groom_email || '',
        groom_mobile: event.wedding_details?.groom_mobile || '',
        // Corporate details
        company_name: event.corporate_details?.company_name || '',
        contact_person: event.corporate_details?.contact_person || '',
        contact_email: event.corporate_details?.contact_email || '',
        contact_mobile: event.corporate_details?.contact_mobile || '',
        company_vat: event.corporate_details?.company_vat || '',
        company_address: event.corporate_details?.company_address || '',
      });
    }
  }, [event, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!id) throw new Error('Event ID is required');
      
      console.log("Submitting form with venues:", data.venues);
      
      // Transform the form data to match EventUpdateData requirements
      const updateData = {
        ...data,
        description: data.description || '',
        event_date: data.event_date || null,
        pax: data.pax || null,
        client_address: data.client_address || null,
      };
      
      await updateEvent(id, updateData);

      // Invalidate and refetch queries
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', id] });
      await queryClient.invalidateQueries({ queryKey: ['passed-events'] });
      await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      // Determine whether to navigate back to events or passed events
      const today = new Date();
      const eventDate = data.event_date ? new Date(data.event_date) : null;
      
      if (eventDate && eventDate >= today && !event?.completed) {
        navigate('/events');
      } else {
        navigate('/passed-events');
      }
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
          onClick={() => {
            const today = new Date();
            const eventDate = event?.event_date ? new Date(event.event_date) : null;
            
            if (eventDate && eventDate >= today && !event.completed) {
              navigate("/events");
            } else {
              navigate("/passed-events");
            }
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Event</h2>
        </div>
      </div>

      <div className="max-w-5xl">
        <EditEventForm 
          form={form} 
          onSubmit={onSubmit}
          onCancel={() => {
            const today = new Date();
            const eventDate = event?.event_date ? new Date(event.event_date) : null;
            
            if (eventDate && eventDate >= today && !event.completed) {
              navigate("/events");
            } else {
              navigate("/passed-events");
            }
          }}
        />
      </div>
    </div>
  );
};

export default EditEvent;
