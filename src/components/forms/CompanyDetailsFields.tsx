import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CompanyDetailsFieldsProps {
  form: UseFormReturn<any>;
  isEditing: boolean;
}

const CompanyDetailsFields = ({ form, isEditing }: CompanyDetailsFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Company Name" 
                  className="bg-white border-zinc-200" 
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_vat"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="VAT Number" 
                  className="bg-white border-zinc-200"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Contact Person" 
                  className="bg-white border-zinc-200"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Contact Number" 
                  className="bg-white border-zinc-200"
                  disabled={!isEditing}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-zinc-500">Address Details</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Street Address" 
                    className="bg-white border-zinc-200"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suburb"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Suburb" 
                    className="bg-white border-zinc-200"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="City" 
                    className="bg-white border-zinc-200"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Postal Code" 
                    className="bg-white border-zinc-200"
                    disabled={!isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default CompanyDetailsFields;