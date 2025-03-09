
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ContactDetails from "@/components/forms/ContactDetails";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ensureUserProfile, createEvent } from "@/utils/eventUtils";
import { useState } from "react";
import { EventFormData } from "@/types/eventForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import { format } from "date-fns";
import EventFormActions from "@/components/forms/EventFormActions";
import { useQueryClient } from "@tanstack/react-query";

const NewEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
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
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }

      await ensureUserProfile(user.id);
      
      const eventCode = generateEventCode();
      
      // Prepare the event data with new contact fields
      const eventData = {
        event_code: eventCode,
        name: data.name,
        description: data.description || null,
        event_type: data.event_type,
        event_date: data.event_date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        pax: data.pax || null,
        client_address: data.client_address || null,
        created_by: user.id,
        completed: false,
        venues: data.venues,
        
        // New contact fields
        primary_name: data.primary_name || null,
        primary_phone: data.primary_phone || null,
        primary_email: data.primary_email || null,
        secondary_name: data.secondary_name || null,
        secondary_phone: data.secondary_phone || null,
        secondary_email: data.secondary_email || null,
        address: data.address || data.client_address || null,
        company: data.company || null,
        vat_number: data.vat_number || null
      };

      await createEvent(eventData, user.id);

      // For backward compatibility, also create the related table entries
      if (data.event_type === 'Wedding') {
        const { error: weddingError } = await supabase
          .from('wedding_details')
          .insert({
            event_code: eventCode,
            bride_name: data.primary_name || data.bride_name || null,
            bride_email: data.primary_email || data.bride_email || null,
            bride_mobile: data.primary_phone || data.bride_mobile || null,
            groom_name: data.secondary_name || data.groom_name || null,
            groom_email: data.secondary_email || data.groom_email || null,
            groom_mobile: data.secondary_phone || data.groom_mobile || null,
          });

        if (weddingError) throw weddingError;
      } else {
        const { error: corporateError } = await supabase
          .from('corporate_details')
          .insert({
            event_code: eventCode,
            company_name: data.company || data.company_name || null,
            contact_person: data.primary_name || data.contact_person || null,
            contact_email: data.primary_email || data.contact_email || null,
            contact_mobile: data.primary_phone || data.contact_mobile || null,
            company_vat: data.vat_number || data.company_vat || null,
            company_address: data.address || data.company_address || null,
          });

        if (corporateError) throw corporateError;
      }

      await queryClient.invalidateQueries({ queryKey: ['events'] });
      await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });

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
            className="h-8 px-2 lg:px-3 -ml-2 focus:ring-0 focus:ring-offset-0"
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
  );
};

export default NewEvent;
