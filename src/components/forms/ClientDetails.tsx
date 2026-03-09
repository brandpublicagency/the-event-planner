import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ClientDetailsProps {
  form: UseFormReturn<any>;
}

const ClientDetails = ({ form }: ClientDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8">
        {/* Bride Details */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Bride Details</h3>
          <p className="text-sm text-muted-foreground">Update the bride's contact information.</p>
          <FormField
            control={form.control}
            name="bride_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Name" className="bg-background border-border" />
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
                <FormControl>
                  <Input {...field} placeholder="Mobile" className="bg-background border-border" />
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
                <FormControl>
                  <Input type="email" {...field} placeholder="Email" className="bg-background border-border" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Groom Details */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Groom Details</h3>
          <p className="text-sm text-muted-foreground">Update the groom's contact information.</p>
          <FormField
            control={form.control}
            name="groom_name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Name" className="bg-background border-border" />
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
                <FormControl>
                  <Input {...field} placeholder="Mobile" className="bg-background border-border" />
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
                <FormControl>
                  <Input type="email" {...field} placeholder="Email" className="bg-white border-zinc-200" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="client_address"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Address" className="bg-white border-zinc-200" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClientDetails;