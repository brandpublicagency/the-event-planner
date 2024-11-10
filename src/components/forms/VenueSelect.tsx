import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface VenueSelectProps {
  form: UseFormReturn<any>;
}

// Updated venue list as requested
const mockVenues = [
  { id: "1", name: "The Gallery" },
  { id: "2", name: "The Kitchen" },
  { id: "3", name: "The Grand Hall" },
  { id: "4", name: "The Lawn" },
  { id: "5", name: "Accommodation" }
];

export const VenueSelect = ({ form }: VenueSelectProps) => {
  const selectedVenues = form.watch('venues') || {};

  const onVenueChange = (venueId: string, checked: boolean) => {
    const currentVenues = form.getValues('venues') || {};
    form.setValue('venues', {
      ...currentVenues,
      [venueId]: checked
    });
  };

  return (
    <FormField
      control={form.control}
      name="venues"
      render={() => (
        <FormItem>
          <FormLabel>Select Venues</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-4">
              {mockVenues?.map((venue) => (
                <label
                  key={venue.id}
                  className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm cursor-pointer hover:bg-zinc-50"
                >
                  <Checkbox
                    checked={selectedVenues[venue.id] || false}
                    onCheckedChange={(checked) => onVenueChange(venue.id, checked as boolean)}
                  />
                  <span>{venue.name}</span>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};