
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
              <SelectItem value="Conference">Conference</SelectItem>
              <SelectItem value="Year-End Function">Year-End Function</SelectItem>
              <SelectItem value="Corporate Function">Corporate Function</SelectItem>
              <SelectItem value="Babyshower or Kitchen Tea">Babyshower or Kitchen Tea</SelectItem>
              <SelectItem value="Celebration or other Party">Celebration or other Party</SelectItem>
              <SelectItem value="Concert or Performance">Concert or Performance</SelectItem>
              <SelectItem value="Private Event">Private Event</SelectItem>
              <SelectItem value="Other Event">Other Event</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
