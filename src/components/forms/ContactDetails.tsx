
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/eventForm";

interface ContactDetailsProps {
  form: UseFormReturn<EventFormData>;
  eventType: EventFormData['event_type'];
}

const ContactDetails = ({ form, eventType }: ContactDetailsProps) => {
  const isWedding = eventType === 'Wedding';
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="primary_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={isWedding ? "Bride's full name" : "Contact person's name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isWedding && (
          <FormField
            control={form.control}
            name="secondary_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Groom's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="primary_email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" placeholder={isWedding ? "Bride's email address" : "Contact email address"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isWedding && (
          <FormField
            control={form.control}
            name="secondary_email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Groom's email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="primary_phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={isWedding ? "Bride's mobile number" : "Contact mobile number"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {isWedding && (
          <FormField
            control={form.control}
            name="secondary_phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Groom's mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {!isWedding && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
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
                  <FormControl>
                    <Input placeholder="VAT number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Full address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactDetails;
