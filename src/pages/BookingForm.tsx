
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { format } from "date-fns";
import { EventFormData } from "@/types/eventForm";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import { supabase } from "@/integrations/supabase/client";
import FormSection from "@/components/forms/FormSection";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ContactDetails from "@/components/forms/ContactDetails";
import { createEvent } from "@/utils/eventUtils";

const BookingForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      // Get a random user ID from profiles to associate with the event
      // In a real scenario, this would be the admin user or a default user
      const { data: adminUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .single();
      
      if (userError || !adminUser) {
        throw new Error('Could not find an admin user to associate with the event');
      }
      
      const eventCode = generateEventCode();
      
      // Prepare the event data
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
        created_by: adminUser.id,
        completed: false,
        venues: data.venues,
        
        // Contact fields
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

      await createEvent(eventData, adminUser.id);

      // For backward compatibility, create the related table entries
      if (data.event_type === 'Wedding') {
        const { error: weddingError } = await supabase
          .from('wedding_details')
          .insert({
            event_code: eventCode,
            bride_name: data.primary_name || null,
            bride_email: data.primary_email || null,
            bride_mobile: data.primary_phone || null,
            groom_name: data.secondary_name || null,
            groom_email: data.secondary_email || null,
            groom_mobile: data.secondary_phone || null,
          });

        if (weddingError) throw weddingError;
      } else {
        const { error: corporateError } = await supabase
          .from('corporate_details')
          .insert({
            event_code: eventCode,
            company_name: data.company || null,
            contact_person: data.primary_name || null,
            contact_email: data.primary_email || null,
            contact_mobile: data.primary_phone || null,
            company_vat: data.vat_number || null,
            company_address: data.address || null,
          });

        if (corporateError) throw corporateError;
      }

      toast({
        title: "Booking Submitted Successfully",
        description: "Thank you for your booking. We will contact you shortly.",
      });

      // Reset the form
      form.reset();
      
      // Optionally navigate to a thank you page
      // navigate('/booking-thank-you');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Submission Error",
        description: error.message || "There was a problem submitting your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Event Booking Form</h1>
          <p className="text-zinc-500 mt-2">Fill out the form below to book your event with us.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormSection 
                title="Event Details" 
                description="Tell us about your event"
              >
                <EventBasicInfo form={form} />
              </FormSection>

              <FormSection 
                title="Contact Information" 
                description={`Please provide your ${eventType === "Wedding" ? "bride and groom" : "contact"} information`}
              >
                <ContactDetails form={form} eventType={eventType} />
              </FormSection>

              <div className="pt-4 border-t flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
