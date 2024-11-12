import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/eventForm";

interface CompanyDetailsProps {
  form: UseFormReturn<EventFormData>;
}

const CompanyDetails = ({ form }: CompanyDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Company Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
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
            <FormLabel className="text-zinc-600">Contact Person</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
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
            <FormLabel className="text-zinc-600">VAT Number</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
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
            <FormLabel className="text-zinc-600">Company Address</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyDetails;