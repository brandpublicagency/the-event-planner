
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EditEventForm from "@/components/forms/EditEventForm";
import { updateEvent } from "@/utils/eventUpdateUtils";
import { EventFormData } from "@/types/eventForm";
import { Header } from "@/components/layout/Header";

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
        .select('*')
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
      const eventType = event.event_type as EventFormData['event_type'];

      const formatTime = (time: string | null) => {
        if (!time) return undefined;
        return time.slice(0, 5);
      };

      const venues = Array.isArray(event.venues) ? event.venues : (event.venues ? [event.venues] : []);
      console.log("Initial venues from database:", venues);

      form.reset({
        name: event.name,
        description: event.description || '',
        event_type: eventType,
        event_date: event.event_date || undefined,
        start_time: formatTime(event.start_time),
        end_time: formatTime(event.end_time),
        pax: event.pax || undefined,
        venues: venues,
        
        primary_name: event.primary_name || '',
        primary_email: event.primary_email || '',
        primary_phone: event.primary_phone || '',
        secondary_name: event.secondary_name || '',
        secondary_email: event.secondary_email || '',
        secondary_phone: event.secondary_phone || '',
        address: event.address || '',
        company: event.company || '',
        vat_number: event.vat_number || '',
        
        bride_name: '',
        bride_email: '',
        bride_mobile: '',
        groom_name: '',
        groom_email: '',
        groom_mobile: '',
        company_name: '',
        contact_person: '',
        contact_email: '',
        contact_mobile: '',
        company_vat: '',
        company_address: '',
      });
    }
  }, [event, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!id) throw new Error('Event ID is required');
      
      console.log("Submitting form with venues:", data.venues);
      
      const updateData = {
        ...data,
        description: data.description || '',
        event_date: data.event_date || null,
        pax: data.pax || null,
      };
      
      await updateEvent(id, updateData);

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['events', id] });
      await queryClient.invalidateQueries({ queryKey: ['event', id] });
      await queryClient.invalidateQueries({ queryKey: ['passed-events'] });
      await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      // Navigate back to event details with parameter indicating we came from edit
      navigate(`/events/${id}?from=edit`);
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
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="Edit Event" 
        showBackButton 
        backButtonPath={`/events/${id}`}
      />
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="max-w-5xl">
          <EditEventForm 
            form={form} 
            onSubmit={onSubmit}
            onCancel={() => navigate(`/events/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
