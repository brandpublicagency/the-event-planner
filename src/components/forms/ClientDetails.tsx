import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ClientDetailsProps {
  form: UseFormReturn<any>;
}

const ClientDetails = ({ form }: ClientDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Bride Details */}
      <div className="space-y-6">
        <h3 className="font-medium text-sm text-muted-foreground">Bride Details</h3>
        <FormField
          control={form.control}
          name="bride_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-600">Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white border-zinc-200" />
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
              <FormLabel className="text-zinc-600">Mobile</FormLabel>
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
              <FormLabel className="text-zinc-600">Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-white border-zinc-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Groom Details */}
      <div className="space-y-6">
        <h3 className="font-medium text-sm text-muted-foreground">Groom Details</h3>
        <FormField
          control={form.control}
          name="groom_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-600">Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white border-zinc-200" />
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
              <FormLabel className="text-zinc-600">Mobile</FormLabel>
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
              <FormLabel className="text-zinc-600">Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="bg-white border-zinc-200" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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