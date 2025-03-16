
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ContactDetails from "@/components/forms/ContactDetails";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile, createEvent } from "@/utils/eventUtils";
import { useState } from "react";
import { EventFormSchema } from "@/schemas/eventFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import { format } from "date-fns";
import EventFormActions from "@/components/forms/EventFormActions";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { triggerNotificationProcessing } from "@/api/notification/triggerNotificationProcessing";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      event_type: 'Wedding' as const,
      venues: []
    }
  });

  const eventType = form.watch("event_type");

  const generateEventCode = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    return `EVENT-${format(date, 'ddMM')}-${timestamp}`;
  };

  const onSubmit = async (data: EventFormSchema) => {
    console.log('Submitting form with venues:', data.venues);
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
        created_by: user.id,
        completed: false,
        venues: data.venues || [],
        
        primary_name: data.primary_name || null,
        primary_phone: data.primary_phone || null,
        primary_email: data.primary_email || null,
        secondary_name: data.secondary_name || null,
        secondary_phone: data.secondary_phone || null,
        secondary_email: data.secondary_email || null,
        address: data.address || null,
        company: data.company || null,
        vat_number: data.vat_number || null
      };

      console.log('Creating event with data:', eventData);
      const eventCodeResult = await createEvent(eventData, user.id);
      console.log('Event created with code:', eventCodeResult);

      // Explicitly trigger notification processing to create immediate notifications
      try {
        console.log('Explicitly triggering notification processing after event creation');
        await triggerNotificationProcessing();
      } catch (notificationError) {
        console.error('Error triggering notifications, but continuing:', notificationError);
        // Don't fail the event creation if notification processing fails
      }

      // Explicitly trigger a refresh of data for realtime updates to work reliably
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
      await queryClient.invalidateQueries({ queryKey: ['chat-context'] });

      toast({
        title: "Success",
        description: "Event created successfully",
        variant: "success",
        showProgress: true
      });

      // Longer delay to allow notification to be processed
      console.log('Waiting before navigation...');
      setTimeout(() => {
        console.log('Navigating to events page');
        navigate('/events');
      }, 1000);
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
    <div className="flex flex-col h-full">
      <Header 
        pageTitle="New Event" 
        showBackButton 
        backButtonPath="/events"
      />
      <div className="flex-1 py-8 px-6 bg-zinc-50/50">
        <div className="container max-w-5xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormSection 
                title="Event Details" 
                description="Enter the basic information about the event."
              >
                <EventBasicInfo form={form} />
              </FormSection>

              <FormSection 
                title="Contact Details" 
                description={`Enter the ${eventType === "Wedding" ? "bride and groom" : "contact"} information.`}
              >
                <ContactDetails form={form} eventType={eventType} />
              </FormSection>

              <EventFormActions 
                isSubmitting={isSubmitting}
                onCancel={() => navigate('/events')}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewEvent;
