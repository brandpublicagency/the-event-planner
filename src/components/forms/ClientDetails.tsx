import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ClientDetailsProps {
  form: UseFormReturn<any>;
}

const ClientDetails = ({ form }: ClientDetailsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="client_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Address</FormLabel>
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

export default ClientDetails;