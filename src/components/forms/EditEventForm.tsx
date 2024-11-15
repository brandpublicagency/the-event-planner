import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { eventFormSchema } from "@/schemas/eventFormSchema";
import type { EventFormData } from "@/types/eventForm";
import FormSection from "./FormSection";
import EventBasicInfo from "./EventBasicInfo";
import BrideDetails from "./BrideDetails";
import GroomDetails from "./GroomDetails";
import CompanyDetails from "./CompanyDetails";
import ClientDetails from "./ClientDetails";
import EventFormActions from "./EventFormActions";

interface EditEventFormProps {
  event: any;
}

export const EditEventForm = ({ event }: EditEventFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.name,
      event_type: event.event_type,
      event_date: event.event_date || '',
      pax: event.pax,
      package_id: event.package_id,
      start_time: event.start_time,
      end_time: event.end_time,
      client_address: event.client_address,
      // Wedding Details
      bride_name: event.wedding_details?.bride_name,
      bride_email: event.wedding_details?.bride_email,
      bride_mobile: event.wedding_details?.bride_mobile,
      groom_name: event.wedding_details?.groom_name,
      groom_email: event.wedding_details?.groom_email,
      groom_mobile: event.wedding_details?.groom_mobile,
      // Corporate Details
      company_name: event.corporate_details?.company_name,
      contact_person: event.corporate_details?.contact_person,
      contact_email: event.corporate_details?.contact_email,
      contact_mobile: event.corporate_details?.contact_mobile,
      company_vat: event.corporate_details?.company_vat,
      company_address: event.corporate_details?.company_address,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      // Update events table
      const { error: eventsError } = await supabase
        .from('events')
        .update({
          name: data.name,
          event_type: data.event_type,
          event_date: data.event_date,
          pax: data.pax,
          package_id: data.package_id,
          start_time: data.start_time,
          end_time: data.end_time,
          client_address: data.client_address,
        })
        .eq('event_code', event.event_code);

      if (eventsError) throw eventsError;

      // Update related tables based on event type
      if (data.event_type === 'Wedding') {
        const { error: weddingError } = await supabase
          .from('wedding_details')
          .upsert({
            event_code: event.event_code,
            bride_name: data.bride_name,
            bride_email: data.bride_email,
            bride_mobile: data.bride_mobile,
            groom_name: data.groom_name,
            groom_email: data.groom_email,
            groom_mobile: data.groom_mobile,
          });

        if (weddingError) throw weddingError;
      } else if (data.event_type === 'Corporate Event') {
        const { error: corporateError } = await supabase
          .from('corporate_details')
          .upsert({
            event_code: event.event_code,
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
        description: "Event updated successfully",
      });

      navigate(`/events/${event.event_code}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          <FormSection title="Basic Information" description="Update the basic details of your event.">
            <EventBasicInfo form={form} />
          </FormSection>

          {form.watch("event_type") === "Wedding" && (
            <div className="grid gap-8 md:grid-cols-2">
              <FormSection title="Bride Details" description="Update the bride's information.">
                <BrideDetails form={form} />
              </FormSection>

              <FormSection title="Groom Details" description="Update the groom's information.">
                <GroomDetails form={form} />
              </FormSection>
            </div>
          )}

          {form.watch("event_type") === "Corporate Event" && (
            <FormSection title="Company Details" description="Update the company information.">
              <CompanyDetails form={form} />
            </FormSection>
          )}

          <FormSection title="Address Information" description="Update the address details.">
            <ClientDetails form={form} />
          </FormSection>
        </div>

        <EventFormActions 
          isSubmitting={form.formState.isSubmitting}
          onCancel={() => navigate(-1)}
        />
      </form>
    </Form>
  );
};