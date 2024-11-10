import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import BrideDetails from "@/components/forms/BrideDetails";
import GroomDetails from "@/components/forms/GroomDetails";
import CompanyDetails from "@/components/forms/CompanyDetails";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      status: 'Inquiry',
      event_type: 'Wedding',
      venues: {}
    }
  });

  const eventType = form.watch("event_type");

  const onSubmit = async (data: any) => {
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      // Create the event in Supabase
      const eventCode = `EVENT-${format(new Date(data.event_date), 'ddMMyy')}`;
      
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          event_code: eventCode,
          name: data.name,
          event_type: data.event_type,
          event_date: data.event_date,
          pax: data.pax,
          package_id: data.package_id,
          created_by: user.id, // Set the created_by field to the current user's ID
        });

      if (eventError) throw eventError;

      // Insert venue relationships
      const selectedVenues = Object.entries(data.venues || {})
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_code: eventCode,
          venue_id: venueId,
        }));

      if (selectedVenues.length > 0) {
        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(selectedVenues);

        if (venueError) throw venueError;
      }

      // Insert event type specific details
      if (data.event_type === 'Wedding') {
        const { error: weddingError } = await supabase
          .from('wedding_details')
          .insert({
            event_code: eventCode,
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
          .insert({
            event_code: eventCode,
            company_name: data.company_name,
            contact_person: data.contact_person,
            contact_email: data.contact_email,
            contact_mobile: data.contact_mobile,
            company_vat: data.company_vat,
            company_address: data.company_address,
          });

        if (corporateError) throw corporateError;
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      navigate('/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

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
          <h2 className="text-3xl font-bold tracking-tight">New Event</h2>
        </div>
      </div>

      <div className="max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormSection 
              title="Event Details" 
              description="Enter the basic information about the event."
            >
              <EventBasicInfo form={form} />
            </FormSection>

            {eventType === "Wedding" ? (
              <>
                <FormSection 
                  title="Bride Details" 
                  description="Enter the bride's contact information."
                >
                  <BrideDetails form={form} />
                </FormSection>

                <FormSection 
                  title="Groom Details" 
                  description="Enter the groom's contact information."
                >
                  <GroomDetails form={form} />
                </FormSection>
              </>
            ) : (
              <FormSection 
                title="Company Details" 
                description="Enter the company's information."
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
              <Button type="submit">Create Event</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewEvent;