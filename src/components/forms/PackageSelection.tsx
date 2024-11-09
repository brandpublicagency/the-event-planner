import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      currency: 'ZAR'
    }).format(price);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages?.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`relative cursor-pointer transition-all ${
                        field.value === pkg.id ? 'border-primary' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{pkg.name}</CardTitle>
                            <CardDescription>{pkg.description}</CardDescription>
                          </div>
                          <RadioGroupItem value={pkg.id} className="mt-1" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatPrice(pkg.base_price)}
                          <span className="text-sm font-normal text-muted-foreground ml-1">excl. VAT</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <div className="text-lg font-semibold">Individual Venues</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {venues?.map((venue) => (
                    <Card 
                      key={venue.id}
                      className={`relative cursor-pointer transition-all ${
                        field.value === venue.id ? 'border-primary' : ''
                      }`}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{venue.name}</CardTitle>
                            <CardDescription>{venue.description}</CardDescription>
                          </div>
                          <RadioGroupItem value={venue.id} className="mt-1" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        {venue.capacity && (
                          <div className="text-sm text-muted-foreground">
                            Up to {venue.capacity} guests
                          </div>
                        )}
                      </CardContent>
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