
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import FormSection from "./FormSection";
import EventBasicInfo from "./EventBasicInfo";
import ContactDetails from "./ContactDetails";
import { VenueSelect } from "./VenueSelect";
import { EventTypeSelect } from "./EventTypeSelect";
import { Loader2 } from "lucide-react";

interface EditEventFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EditEventForm = ({ form, onSubmit, onCancel, isSubmitting = false }: EditEventFormProps) => {
  const eventType = form.watch('event_type');
  
  const handleSubmitAction = form.handleSubmit(onSubmit);
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmitAction} className="space-y-8">
        <FormSection 
          title="Event Details" 
          description="Update the basic information about the event."
        >
          <div className="space-y-6">
            <EventTypeSelect form={form} />
            <EventBasicInfo form={form} />
          </div>
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

        <div className="flex justify-end space-x-4 sticky bottom-0 bg-zinc-50/80 backdrop-blur-sm p-4 -mx-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitSuccessful ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditEventForm;
