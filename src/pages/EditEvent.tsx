import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import BrideDetails from "@/components/forms/BrideDetails";
import GroomDetails from "@/components/forms/GroomDetails";
import CompanyDetails from "@/components/forms/CompanyDetails";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
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
        if (ev.venues) {
          acc[ev.venues.id] = true;
        }
        return acc;
      }, {});

      // Reset form with event data
      form.reset({
        ...event,
        ...event.wedding_details,
        ...event.corporate_details,
        venues: venuesData,
        event_date: event.event_date ? new Date(event.event_date).toISOString() : null,
      });
    }
  }, [event, form]);

  const onSubmit = async (data: any) => {
    try {
      // Update event details
      const { error: eventError } = await supabase
        .from('events')
        .update({
          name: data.name,
          event_type: data.event_type,
          event_date: data.event_date,
          pax: data.pax,
          package_id: data.package,
          client_address: data.client_address,
        })
        .eq('event_code', id);

      if (eventError) throw eventError;

      // Update wedding or corporate details based on event type
      if (data.event_type === 'Wedding') {
        const { error: weddingError } = await supabase
          .from('wedding_details')
          .upsert({
            event_code: id,
            bride_name: data.bride_name,
            bride_email: data.bride_email,
            bride_mobile: data.bride_mobile,
            groom_name: data.groom_name,
            groom_email: data.groom_email,
            groom_mobile: data.groom_mobile,
          });

        if (weddingError) throw weddingError;
      } else {
        const { error: corporateError } = await supabase
          .from('corporate_details')
          .upsert({
            event_code: id,
            company_name: data.company_name,
            contact_person: data.contact_person,
            company_vat: data.company_vat,
            company_address: data.company_address,
          });

        if (corporateError) throw corporateError;
      }

      // Update venues
      const selectedVenues = Object.entries(data.venues || {})
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_code: id,
          venue_id: venueId,
        }));

      // Delete existing venue relationships
      await supabase
        .from('event_venues')
        .delete()
        .eq('event_code', id);

      // Insert new venue relationships
      if (selectedVenues.length > 0) {
        const { error: venuesError } = await supabase
          .from('event_venues')
          .insert(selectedVenues);

        if (venuesError) throw venuesError;
      }

      toast({
        title: "Success",
        description: "Event updated successfully",
      });

      navigate('/events');
    } catch (error: any) {
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

            {form.watch('event_type') === "Wedding" ? (
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