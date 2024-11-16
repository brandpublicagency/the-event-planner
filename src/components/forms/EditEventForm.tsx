import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import FormSection from "./FormSection";
import EventBasicInfo from "./EventBasicInfo";
import BrideDetails from "./BrideDetails";
import GroomDetails from "./GroomDetails";
import CompanyDetails from "./CompanyDetails";

interface EditEventFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const EditEventForm = ({ form, onSubmit, onCancel }: EditEventFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormSection 
          title="Event Details" 
          description="Update the basic information about the event."
        >
          <EventBasicInfo form={form} />
        </FormSection>

        {form.watch('event_type') === "Wedding" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <FormSection 
              title="Bride Details" 
              description="Update the bride's contact information."
            >
              <BrideDetails form={form} />
            </FormSection>

            <FormSection 
              title="Groom Details" 
              description="Update the groom's contact information."
            >
              <GroomDetails form={form} />
            </FormSection>
          </div>
        ) : (
          <FormSection 
            title="Company Details" 
            description="Update the company's information."
          >
            <CompanyDetails form={form} />
          </FormSection>
        )}

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