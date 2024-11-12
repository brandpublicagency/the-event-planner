import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import BrideDetails from "@/components/forms/BrideDetails";
import GroomDetails from "@/components/forms/GroomDetails";
import CompanyDetails from "@/components/forms/CompanyDetails";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile, createEvent } from "@/utils/eventUtils";
import { useState } from "react";
import { EventFormData } from "@/types/eventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  event_type: z.enum(["Wedding", "Corporate Event", "Celebration", "Conference", "Other"]),
  event_date: z.string().optional(),
  pax: z.number().min(1, "Number of guests must be at least 1").optional(),
  package_id: z.string().optional(),
  client_address: z.string().optional(),
  venues: z.record(z.string(), z.boolean()),
  // Wedding specific fields
  bride_name: z.string().optional(),
  bride_email: z.string().email().optional(),
  bride_mobile: z.string().optional(),
  groom_name: z.string().optional(),
  groom_email: z.string().email().optional(),
  groom_mobile: z.string().optional(),
  // Corporate specific fields
  company_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_mobile: z.string().optional(),
  company_vat: z.string().optional(),
  company_address: z.string().optional(),
});

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      event_type: 'Wedding',
      venues: {}
    }
  });

  const eventType = form.watch("event_type");

  const generateEventCode = () => {
    const date = new Date();
    return `EVENT-${format(date, 'ddMM')}`;
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      await ensureUserProfile(user.id);
      
      // Create the event with the required EventCreate type
      const eventCode = generateEventCode();
      const eventData = {
        event_code: eventCode,
        name: data.name,
        description: data.description || null,
        event_type: data.event_type,
        event_date: data.event_date || null,
        pax: data.pax || null,
        package_id: data.package_id || null,
        client_address: data.client_address || null,
        created_by: user.id
      };

      await createEvent(eventData, user.id);

      const selectedVenues = Object.entries(data.venues || {})
        .filter(([_, selected]) => selected)
        .map(([venueId]) => ({
          event_code: eventCode,
          venue_id: venueId,
        }));

      if (selectedVenues.length > 0) {
        const { error: venueError } = await supabase
          .from('event_venues')
          .upsert(selectedVenues, {
            onConflict: 'event_code,venue_id',
            ignoreDuplicates: true
          });

        if (venueError) throw venueError;
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="container max-w-5xl py-8">
        <div className="mb-8 space-y-4">
          <Button 
            variant="ghost" 
            className="h-8 px-2 lg:px-3 -ml-2"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">New Event</h2>
            <p className="text-sm text-zinc-500 mt-1">Create a new event by filling out the form below.</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection 
              title="Event Details" 
              description="Enter the basic information about the event."
            >
              <EventBasicInfo form={form} />
            </FormSection>

            {eventType === "Wedding" ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
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
                </div>
              </>
            ) : (
              <FormSection 
                title="Company Details" 
                description="Enter the company's information."
              >
                <CompanyDetails form={form} />
              </FormSection>
            )}

            <div className="flex justify-end space-x-4 sticky bottom-0 bg-zinc-50/80 backdrop-blur-sm p-4 -mx-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/events')}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Event
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewEvent;