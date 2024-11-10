import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import BrideDetails from "@/components/forms/BrideDetails";
import GroomDetails from "@/components/forms/GroomDetails";
import CompanyDetails from "@/components/forms/CompanyDetails";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";

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
      // Generate event code
      const eventCode = `EVENT-${format(new Date(data.event_date), 'ddMM')}`;
      
      // Create the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([{
          ...data,
          event_code: eventCode,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (eventError) throw eventError;

      // Create venue relationships if any venues are selected
      const selectedVenues = Object.entries(data.venues || {})
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_id: eventCode,
          venue_id: venueId
        }));

      if (selectedVenues.length > 0) {
        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(selectedVenues);

        if (venueError) throw venueError;
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
