
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { EventFormData } from "@/types/eventForm";

const VENUE_OPTIONS = [
  "The Kitchen",
  "The Gallery",
  "The Grand Hall",
  "Package 1",
  "Package 2",
  "Package 3"
];

interface VenueSelectProps {
  form: UseFormReturn<EventFormData>;
}

export const VenueSelect = ({ form }: VenueSelectProps) => {
  const venues = form.watch("venues") || [];
  
  const handleVenueChange = (venue: string, checked: boolean) => {
    const currentVenues = [...venues];
    
    if (checked && !currentVenues.includes(venue)) {
      currentVenues.push(venue);
    } else if (!checked && currentVenues.includes(venue)) {
      const index = currentVenues.indexOf(venue);
      currentVenues.splice(index, 1);
    }
    
    form.setValue("venues", currentVenues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name="venues"
      render={() => (
        <FormItem>
          <FormLabel>Venues</FormLabel>
          <div className="space-y-2">
            {VENUE_OPTIONS.map((venue) => (
              <div key={venue} className="flex items-center space-x-2">
                <Checkbox 
                  id={`venue-${venue}`}
                  checked={venues.includes(venue)}
                  onCheckedChange={(checked) => {
                    handleVenueChange(venue, checked as boolean);
                  }}
                />
                <label 
                  htmlFor={`venue-${venue}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {venue}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
