
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { publicEventFormSchema, type PublicEventFormValues } from "@/schemas/publicEventFormSchema";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import EventBasicInfo from "@/components/forms/EventBasicInfo";
import ContactDetails from "@/components/forms/ContactDetails";
import FormSection from "@/components/forms/FormSection";
import { createEvent } from "@/utils/eventUtils";
import { useNavigate } from "react-router-dom";

const PublicEventForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const form = useForm<PublicEventFormValues>({
    resolver: zodResolver(publicEventFormSchema),
    defaultValues: {
      event_type: "Wedding" as const,
      venues: [],
      name: "",
      event_date: format(new Date(), 'yyyy-MM-dd'),
      primary_name: "",
      primary_phone: "",
      primary_email: "",
      // Explicitly set optional fields
      description: undefined,
      start_time: null,
      end_time: null,
      pax: null,
      secondary_name: undefined,
      secondary_phone: undefined,
      secondary_email: undefined,
      address: undefined,
      company: undefined,
      vat_number: undefined
    }
  });

  const eventType = form.watch("event_type");

  const generateEventCode = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    return `EVENT-${format(date, 'ddMM')}-${timestamp}`;
  };

  const onSubmit = async (data: PublicEventFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const { data: adminUsers, error: adminError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (adminError) throw new Error("Couldn't find an admin user to assign this event to");
      
      const adminId = adminUsers?.[0]?.id || "system";
      
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
        created_by: adminId,
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
        vat_number: data.vat_number || null,
        
        public_submission: true
      };

      await createEvent(eventData, adminId);

      setSubmitSuccess(true);
      form.reset();
      
    } catch (error: any) {
      console.error('Error submitting event:', error);
      setErrorMessage(error.message || "There was an error submitting your event request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground mb-6">Your event request has been successfully submitted. Our team will be in touch with you shortly.</p>
        <Button onClick={() => setSubmitSuccess(false)} variant="outline">Submit Another Request</Button>
      </div>
    );
  }

  return (
    <div>
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {errorMessage}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection 
            title="Event Details" 
            description="Tell us about your event"
          >
            <EventBasicInfo 
              form={form as any}
            />
          </FormSection>

          <FormSection 
            title="Contact Details" 
            description={`Enter ${eventType === "Wedding" ? "bride and groom" : "contact"} information`}
          >
            <ContactDetails 
              form={form as any}
              eventType={eventType} 
            />
          </FormSection>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Event Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PublicEventForm;
