import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormData } from "@/types/eventForm";

interface BrideDetailsProps {
  form: UseFormReturn<EventFormData>;
}

const BrideDetails = ({ form }: BrideDetailsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="bride_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-muted-foreground">Name</FormLabel>
            <FormControl>
              <Input {...field} className="bg-background border-border" />
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
            <FormLabel className="text-muted-foreground">Mobile</FormLabel>
            <FormControl>
              <Input {...field} type="tel" className="bg-background border-border" />
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
            <FormLabel className="text-muted-foreground">Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} className="bg-background border-border" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BrideDetails;