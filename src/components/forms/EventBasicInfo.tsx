
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
}

const EventBasicInfo = ({ form }: EventBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter event name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter event description"
                className="resize-none min-h-[80px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="pax"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Guests</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of guests"
                {...field}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : undefined;
                  field.onChange(value);
                }}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="event_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter any special requirements or notes"
                className="resize-none min-h-[120px]"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EventBasicInfo;
