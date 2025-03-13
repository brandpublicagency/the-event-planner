import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="primary_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder={isWedding ? "Bride's Name" : "Contact Name"} 
                  aria-label={isWedding ? "Bride's Name" : "Contact Name"}
                  {...field} 
                  className="bg-white" 
                />
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
              <FormControl>
                <Input 
                  placeholder={isWedding ? "Bride's Email" : "Contact Email"} 
                  aria-label={isWedding ? "Bride's Email" : "Contact Email"}
                  type="email"
                  {...field} 
                  className="bg-white" 
                />
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
              <FormControl>
                <Input 
                  placeholder={isWedding ? "Bride's Phone" : "Contact Phone"} 
                  aria-label={isWedding ? "Bride's Phone" : "Contact Phone"}
                  type="tel"
                  {...field} 
                  className="bg-white" 
                />
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
                  <FormControl>
                    <Input 
                      placeholder="Groom's Name" 
                      aria-label="Groom's Name"
                      {...field} 
                      className="bg-white" 
                    />
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
                  <FormControl>
                    <Input 
                      placeholder="Groom's Email" 
                      aria-label="Groom's Email"
                      type="email"
                      {...field} 
                      className="bg-white" 
                    />
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
                  <FormControl>
                    <Input 
                      placeholder="Groom's Phone" 
                      aria-label="Groom's Phone"
                      type="tel"
                      {...field} 
                      className="bg-white" 
                    />
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
                  <FormControl>
                    <Input 
                      placeholder="Company Name" 
                      aria-label="Company Name"
                      {...field} 
                      className="bg-white" 
                    />
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
                    <Input 
                      placeholder="VAT Number" 
                      aria-label="VAT Number"
                      {...field} 
                      className="bg-white" 
                    />
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
            <FormControl>
              <Textarea 
                placeholder="Address" 
                aria-label="Address"
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