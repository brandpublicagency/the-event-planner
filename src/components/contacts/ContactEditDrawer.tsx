
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { updateContact } from "@/services/contactService";
import type { Contact } from "@/types/contact";
import OffCanvasDrawer from "@/components/ui/off-canvas-drawer";
import { contactFormSchema, ContactFormValues } from "./contact-schemas";
import PersonalInfoSection from "./drawer-sections/PersonalInfoSection";
import BusinessInfoSection from "./drawer-sections/BusinessInfoSection";
import EventsBookedSection from "./drawer-sections/EventsBookedSection";
import ActionButtons from "./drawer-sections/ActionButtons";
import { useContactActivityLogging } from "@/hooks/useContactActivityLogging";

interface ContactEditDrawerProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const ContactEditDrawer = ({
  contact,
  isOpen,
  onClose,
  onUpdateSuccess
}: ContactEditDrawerProps) => {
  const { toast } = useToast();
  const { logContactUpdated, currentUser } = useContactActivityLogging();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      address: contact.address || "",
      vat_number: contact.vat_number || ""
    }
  });
  
  const onSubmit = async (values: ContactFormValues) => {
    try {
      // Determine which fields were changed
      const originalValues = {
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        address: contact.address || "",
        vat_number: contact.vat_number || ""
      };
      
      const changedFields = Object.keys(values).filter(
        key => values[key as keyof ContactFormValues] !== originalValues[key as keyof typeof originalValues]
      );
      
      // Update the contact first
      const updatedContact = await updateContact(contact, values);
      
      // Log the contact update if there are changed fields and we have an updated contact
      if (changedFields.length > 0 && updatedContact) {
        // Call the function without checking its return value
        await logContactUpdated(updatedContact, changedFields);
      }
      
      onUpdateSuccess();
      toast({
        title: "Contact updated",
        description: `Contact updated successfully by ${currentUser?.name || 'current user'}`,
        variant: "success"
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive"
      });
    }
  };

  return <OffCanvasDrawer isOpen={isOpen} onClose={onClose} title={`Edit Contact: ${contact.name}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 space-y-5">
            {/* Personal Information */}
            <PersonalInfoSection form={form} />
            
            {/* Business Information */}
            <BusinessInfoSection form={form} />
            
            {/* Events Booked Section */}
            <EventsBookedSection contact={contact} />
          </div>
          
          {/* Action Buttons - Now at the bottom */}
          <ActionButtons onClose={onClose} isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </OffCanvasDrawer>;
};

export default ContactEditDrawer;
