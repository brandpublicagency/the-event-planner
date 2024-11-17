import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/eventForm";

interface CompanyDetailsProps {
  form: UseFormReturn<EventFormData>;
}

const CompanyDetails = ({ form }: CompanyDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Company Name" className="bg-white border-zinc-200" />
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
              <Input {...field} placeholder="Contact Person" className="bg-white border-zinc-200" />
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
              <Input {...field} placeholder="VAT Number" className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_address"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormControl>
              <Input {...field} placeholder="Company Address" className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyDetails;