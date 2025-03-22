
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { updateContact } from "@/services/contactService";
import type { Contact } from "@/types/contact";
import OffCanvasDrawer from "@/components/ui/off-canvas-drawer";
import { contactFormSchema, ContactFormValues } from "./contact-schemas";
import PersonalInfoSection from "./drawer-sections/PersonalInfoSection";
import BusinessInfoSection from "./drawer-sections/BusinessInfoSection";
import EventsBookedSection from "./drawer-sections/EventsBookedSection";
import ActionButtons from "./drawer-sections/ActionButtons";

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
      await updateContact(contact, values);
      
      onUpdateSuccess();
      console.log("Contact updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Failed to update contact:", error.message);
    }
  };

  return (
    <OffCanvasDrawer isOpen={isOpen} onClose={onClose} title={`Edit Contact: ${contact.name}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 space-y-5">
            <PersonalInfoSection form={form} />
            <BusinessInfoSection form={form} />
            <EventsBookedSection contact={contact} />
          </div>
          <ActionButtons onClose={onClose} isSubmitting={form.formState.isSubmitting} />
        </form>
      </Form>
    </OffCanvasDrawer>
  );
};

export default ContactEditDrawer;
