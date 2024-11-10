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
              className="flex flex-wrap gap-3"
            >
              {VENUES.map((venue) => (
                <FormItem key={venue.id} className="flex items-center space-x-0 space-y-0">
                  <FormControl>
                    <label className="relative flex cursor-pointer rounded-full border bg-white px-4 py-2 shadow-sm focus:outline-none">
                      <RadioGroupItem 
                        value={venue.id} 
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      />
                      <span className="mr-6">{venue.name}</span>
                    </label>
                  </FormControl>
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