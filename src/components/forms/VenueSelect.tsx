
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { Check } from "lucide-react";

// These values MUST match exactly what's expected in the database trigger
const VENUE_OPTIONS = [
  {
    id: "the-kitchen",
    name: "The Kitchen",
    description: "Perfect for intimate events (10-70 guests)",
  },
  {
    id: "the-gallery",
    name: "The Gallery",
    description: "Light-filled ceremony space (10-180 guests)",
  },
  {
    id: "the-grand-hall",
    name: "The Grand Hall", 
    description: "Spacious reception venue (60-180 guests)",
  },
  {
    id: "the-lawn",
    name: "The Lawn", 
    description: "Beautiful outdoor space for ceremonies",
  },
  {
    id: "the-avenue",
    name: "The Avenue", 
    description: "Elegant tree-lined venue for outdoor events",
  },
  {
    id: "package-1",
    name: "Package 1",
    description: "Gallery, Grand Hall, Kitchen & Accommodation",
  },
  {
    id: "package-2",
    name: "Package 2",
    description: "Gallery, Kitchen & Accommodation (max 60 pax)",
  },
  {
    id: "package-3",
    name: "Package 3",
    description: "Gallery, Kitchen & Grand Hall",
  }
];

interface VenueSelectProps {
  form: UseFormReturn<any>;
}

export const VenueSelect = ({ form }: VenueSelectProps) => {
  const venues = form.watch("venues") || [];
  
  useEffect(() => {
    console.log("VenueSelect component venues:", venues);
  }, [venues]);
  
  const handleVenueChange = (venue: string, checked: boolean) => {
    const currentVenues = [...venues];
    
    if (checked && !currentVenues.includes(venue)) {
      currentVenues.push(venue);
    } else if (!checked && currentVenues.includes(venue)) {
      const index = currentVenues.indexOf(venue);
      currentVenues.splice(index, 1);
    }
    
    console.log(`Updated venue selection: ${venue} to ${checked}, new venues:`, currentVenues);
    form.setValue("venues", currentVenues, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name="venues"
      render={() => (
        <FormItem>
          <FormControl>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {VENUE_OPTIONS.map((venue) => {
                const isSelected = venues.includes(venue.name);
                return (
                  <div
                    key={venue.id}
                    onClick={() => handleVenueChange(venue.name, !isSelected)}
                    className={`
                      relative cursor-pointer rounded-md p-3 transition-all
                      border hover:border-primary hover:shadow-sm
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 bg-white'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-primary">
                        <Check size={16} />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-sm">{venue.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">{venue.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
