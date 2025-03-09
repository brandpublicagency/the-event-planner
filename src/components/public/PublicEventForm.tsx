
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { publicEventFormSchema } from "@/schemas/publicEventFormSchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "../ui/spinner"; 
import EventBasicInfo from "../forms/EventBasicInfo";
import EventTypeSelect from "../forms/EventTypeSelect";
import EventDateSelect from "../forms/EventDateSelect";
import { VenueSelect } from "../forms/VenueSelect";
import ContactDetails from "../forms/ContactDetails";
import { supabase } from "@/integrations/supabase/client";

// Define simple interfaces for form data to avoid excessive type instantiation
interface PublicEventFormValues {
  name: string;
  description?: string;
  event_type: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  pax?: number;
  venues?: string[];
  [key: string]: any; // Allow for additional fields
}

export default function PublicEventForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<PublicEventFormValues>({
    resolver: zodResolver(publicEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      event_type: "Wedding",
      pax: undefined,
      venues: [],
      primary_name: "",
      primary_email: "",
      primary_phone: "",
    },
  });

  async function onSubmit(values: PublicEventFormValues) {
    setIsSubmitting(true);

    try {
      console.log("Submitting form with values:", values);

      // Generate a unique event code
      const timestamp = Date.now().toString().slice(-6);
      const eventCode = `EVENT-PUB-${timestamp}`;

      // Prepare data for insertion
      const eventData = {
        ...values,
        event_code: eventCode,
        // Set as public event
        is_public_submission: true
      };

      // Insert into the events table
      const { error } = await supabase
        .from('events')
        .insert(eventData);

      if (error) {
        throw error;
      }

      toast({
        title: "Event Request Submitted",
        description: "Thank you for your event request. We'll contact you soon.",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your event request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="mb-4">Your event request has been submitted successfully.</p>
        <p>Our team will review your details and get in touch with you soon.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventBasicInfo form={form} />
        <EventTypeSelect form={form} />
        <EventDateSelect form={form} />
        <VenueSelect form={form} />
        <ContactDetails form={form} />

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="mr-2" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Event Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
