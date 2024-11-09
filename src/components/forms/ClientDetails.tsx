import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ClientDetailsProps {
  form: UseFormReturn<any>;
}

const ClientDetails = ({ form }: ClientDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="bride_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Bride Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bride_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Bride Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bride_mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Bride Mobile</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="groom_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Groom Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="groom_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Groom Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="groom_mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-zinc-600">Groom Mobile</FormLabel>
            <FormControl>
              <Input {...field} className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_address"
        render={({ field }) => (
          <FormItem className="col-span-2">
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