
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

export interface ContactDetailsProps {
  form: UseFormReturn<any>;
  eventType: string;
}

const ContactDetails = ({ form, eventType }: ContactDetailsProps) => {
  const isWedding = eventType === "Wedding";
  const isCorporate = eventType === "Corporate Event";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="primary_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isWedding ? "Bride's Name" : "Contact Name"}</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primary_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isWedding ? "Bride's Email" : "Contact Email"}</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="primary_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isWedding ? "Bride's Phone" : "Contact Phone"}</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isWedding && (
          <>
            <FormField
              control={form.control}
              name="secondary_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groom's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groom's Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Groom's Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {isCorporate && (
          <>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} className="bg-white" />
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
                    <Input placeholder="Enter VAT number" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter address" 
                {...field} 
                className="resize-none bg-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContactDetails;
