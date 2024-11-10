import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface VenueSelectProps {
  form: UseFormReturn<any>;
}

// Updated venue list with proper UUIDs
const mockVenues = [
  { id: "123e4567-e89b-12d3-a456-426614174001", name: "The Gallery" },
  { id: "123e4567-e89b-12d3-a456-426614174002", name: "The Kitchen" },
  { id: "123e4567-e89b-12d3-a456-426614174003", name: "The Grand Hall" },
  { id: "123e4567-e89b-12d3-a456-426614174004", name: "The Lawn" },
  { id: "123e4567-e89b-12d3-a456-426614174005", name: "Accommodation" }
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