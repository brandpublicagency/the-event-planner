
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ContactDetails from "@/components/forms/ContactDetails";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile, createEvent } from "@/utils/eventUtils";
import { useState } from "react";
import { EventFormData } from "@/types/eventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import { format } from "date-fns";
import EventFormActions from "@/components/forms/EventFormActions";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: '',
      event_type: 'Wedding',
      venues: []
    }
  });

  const eventType = form.watch("event_type");

  const generateEventCode = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    return `EVENT-${format(date, 'ddMM')}-${timestamp}`;
  };

  const onSubmit = async (data: EventFormData) => {
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

      await createEvent(eventData, user.id);

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
      await queryClient.invalidateQueries({ queryKey: ['chat-context'] });

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
