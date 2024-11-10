import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import BrideDetails from "@/components/forms/BrideDetails";
import GroomDetails from "@/components/forms/GroomDetails";
import CompanyDetails from "@/components/forms/CompanyDetails";
import { ArrowLeft } from "lucide-react";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      // First fetch the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('event_code', id)
        .single();
      
      if (eventError) throw eventError;

      // Then fetch the venues for this event
      const { data: venueData, error: venueError } = await supabase
        .from('event_venues')
        .select('venue_id')
        .eq('event_id', id);

      if (venueError) throw venueError;
      
      // Transform venues array to object format
      const venuesObject = venueData.reduce((acc: Record<string, boolean>, ev) => {
        acc[ev.venue_id] = true;
        return acc;
      }, {});
      
      return { ...eventData, venues: venuesObject };
    },
  });

  React.useEffect(() => {
    if (event) {
      const formData = {
        ...event,
        event_date: new Date(event.event_date)
      };
      form.reset(formData);
    }
  }, [event, form]);

  const onSubmit = async (data: any) => {
    try {
      // Update event data
      const { error: eventError } = await supabase
        .from('events')
        .update(data)
        .eq('event_code', id);

      if (eventError) throw eventError;

      // Update venue relationships
      const selectedVenues = Object.entries(data.venues || {})
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_id: id,
          venue_id: venueId
        }));

      // Delete existing venue relationships
      await supabase
        .from('event_venues')
        .delete()
        .eq('event_id', id);

      // Insert new venue relationships
      if (selectedVenues.length > 0) {
        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(selectedVenues);

        if (venueError) throw venueError;
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      navigate('/events');
    } catch (error: any) {
      console.error('Error updating event:', error);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormSection 
              title="Event Details" 
              description="Update the basic information about the event."
            >
              <EventBasicInfo form={form} />
            </FormSection>

            {event?.event_type === "Wedding" ? (
              <>
                <FormSection 
                  title="Bride Details" 
                  description="Update the bride's contact information."
                >
                  <BrideDetails form={form} />
                </FormSection>

                <FormSection 
                  title="Groom Details" 
                  description="Update the groom's contact information."
                >
                  <GroomDetails form={form} />
                </FormSection>
              </>
            ) : (
              <FormSection 
                title="Company Details" 
                description="Update the company's information."
              >
                <CompanyDetails form={form} />
              </FormSection>
            )}

            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/events')}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditEvent;