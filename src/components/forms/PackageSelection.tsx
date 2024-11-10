import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PackageSelectionProps {
  form: UseFormReturn<any>;
}

const PackageSelection = ({ form }: PackageSelectionProps) => {
  const { data: packages, isError: isPackagesError } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('base_price', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: venues, isError: isVenuesError } = useQuery({
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('ZAR', 'R');
  };

  if (isPackagesError || isVenuesError) {
    return <div className="text-red-500">Error loading packages or venues</div>;
  }

  return (
    <FormField
      control={form.control}
      name="package_id"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select Package or Venue</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              <div className="space-y-4">
                <div className="text-lg font-semibold">Packages</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages?.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`relative cursor-pointer transition-all hover:border-primary ${
                        field.value === pkg.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="p-6 flex justify-between items-start">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <h3 className="text-lg font-semibold">{pkg.name}</h3>
                              {pkg.discount_percentage > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  SAVE {pkg.discount_percentage}%
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">{pkg.description}</p>
                          </div>
                          <div className="text-2xl font-bold">
                            {formatPrice(pkg.base_price)}
                          </div>
                        </div>
                        <RadioGroupItem value={pkg.id} className="mt-1" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div className="text-lg font-semibold">Individual Venues</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venues?.map((venue) => (
                    <Card 
                      key={venue.id}
                      className={`relative cursor-pointer transition-all hover:border-primary ${
                        field.value === venue.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="p-6 flex justify-between items-start">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold">{venue.name}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{venue.description}</p>
                          </div>
                          {venue.capacity && (
                            <div className="text-sm text-muted-foreground">
                              Up to {venue.capacity} guests
                            </div>
                          )}
                        </div>
                        <RadioGroupItem value={venue.id} className="mt-1" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PackageSelection;