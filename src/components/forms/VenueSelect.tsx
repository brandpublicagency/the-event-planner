import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";

interface VenueSelectProps {
  form: UseFormReturn<any>;
}

const VENUES = [
  { id: 'gallery', name: 'The Gallery' },
  { id: 'kitchen', name: 'The Kitchen' },
  { id: 'grand_hall', name: 'The Grand Hall' },
  { id: 'lawn', name: 'The Lawn' },
  { id: 'accommodation', name: 'Accommodation' },
];

export const VenueSelect = ({ form }: VenueSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="venue_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Venue</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-2 gap-4"
            >
              {VENUES.map((venue) => (
                <FormItem key={venue.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={venue.id} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {venue.name}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};