
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import FormSection from "./FormSection";
import EventBasicInfo from "./EventBasicInfo";
import ContactDetails from "./ContactDetails";
import { VenueSelect } from "./VenueSelect";

interface EditEventFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EditEventForm = ({ form, onSubmit, onCancel }: EditEventFormProps) => {
  const eventType = form.watch('event_type');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection 
          title="Event Details" 
          description="Update the basic information about the event."
        >
          <EventBasicInfo form={form} />
        </FormSection>
        
        <FormSection
          title="Venue Selection"
          description="Select one or more venues for your event."
        >
          <VenueSelect form={form} />
        </FormSection>

        <FormSection 
          title="Contact Details" 
          description={`Update the ${eventType === "Wedding" ? "bride and groom" : "contact"} information.`}
        >
          <ContactDetails form={form} eventType={eventType} />
        </FormSection>

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditEventForm;
