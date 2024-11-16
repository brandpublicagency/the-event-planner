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
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile, createEvent } from "@/utils/eventUtils";
import { useState } from "react";
import { EventFormData } from "@/types/eventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import { format } from "date-fns";
import EventFormActions from "@/components/forms/EventFormActions";

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
    const timestamp = date.getTime().toString().slice(-4); // Get last 4 digits of timestamp
    return `EVENT-${format(date, 'ddMM')}-${timestamp}`;
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      await ensureUserProfile(user.id);
      
      const eventCode = generateEventCode();
      const eventData = {
        event_code: eventCode,
        name: data.name,
        description: data.description || null,
        event_type: data.event_type,
        event_date: data.event_date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
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
            ) : (
              <FormSection 
                title="Company Details" 
                description="Enter the company's information."
              >
                <CompanyDetails form={form} />
              </FormSection>
            )}

            <EventFormActions 
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/events')}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewEvent;