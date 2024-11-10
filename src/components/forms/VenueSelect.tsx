import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VenueSelectProps {
  form: UseFormReturn<any>;
}

export const VenueSelect = ({ form }: VenueSelectProps) => {
  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });

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
              {venues?.map((venue) => (
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