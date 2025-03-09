
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface EventTypeSelectProps {
  form: UseFormReturn<any>;
}

export const EventTypeSelect = ({ form }: EventTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="event_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Wedding">Wedding</SelectItem>
              <SelectItem value="Corporate Event">Corporate Event</SelectItem>
              <SelectItem value="Celebration">Celebration</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
              <SelectItem value="Private Event">Private Event</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
