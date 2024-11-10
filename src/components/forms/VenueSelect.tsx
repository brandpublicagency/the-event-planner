import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
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
      name="selected_venues"
      render={() => (
        <FormItem>
          <FormLabel>Selected Venues</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {VENUES.map((venue) => (
              <FormField
                key={venue.id}
                control={form.control}
                name={`venues.${venue.id}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {venue.name}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};