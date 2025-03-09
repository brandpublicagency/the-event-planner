
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { updateContact } from "@/services/contactService";
import type { Contact } from "@/types/contact";
import OffCanvasDrawer from "@/components/ui/off-canvas-drawer";
import { formatDate } from "@/utils/formatDate";

// Enhanced schema to include all possible contact fields
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  vat_number: z.string().optional().or(z.literal("")),
});

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
  onUpdateSuccess,
}: ContactEditDrawerProps) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      address: contact.address || "",
      vat_number: contact.vat_number || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    try {
      await updateContact(contact, values);
      onUpdateSuccess();
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive",
      });
    }
  };

  return (
    <OffCanvasDrawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Edit Contact: ${contact.name}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Personal Information */}
          <div className="border-b pb-4 mb-5">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Business Information */}
          <div className="border-b pb-4 mb-5">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Business Information</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vat_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Event Information (Read-only) */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Event Information</h3>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Event:</span>
                <span className="text-sm">{contact.eventName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Date:</span>
                <span className="text-sm">{contact.eventDate ? formatDate(contact.eventDate) : 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Venue:</span>
                <span className="text-sm">{contact.venue || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Contact Type:</span>
                <span className="text-sm">{
                  contact.contactType === 'corporate' 
                    ? 'Corporate Contact' 
                    : contact.contactType === 'wedding-bride' 
                      ? 'Bride' 
                      : 'Groom'
                }</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </OffCanvasDrawer>
  );
};

export default ContactEditDrawer;
