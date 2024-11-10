import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface PackageSelectionProps {
  form: UseFormReturn<any>;
}

type PackageType = Database['public']['Enums']['package_type'];

const PackageSelection = ({ form }: PackageSelectionProps) => {
  const { data: packages, isError: isPackagesError } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          package_venues(
            venue:venues(*)
          )
        `)
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

  const handlePackageSelection = async (packageId: string) => {
    // First check if the package exists
    const selectedPackage = packages?.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      console.error('Selected package not found');
      return;
    }

    // Update the form with the package ID
    form.setValue('package_id', packageId);
    
    // Get all venue IDs associated with this package
    const venueIds = selectedPackage.package_venues.map((pv: any) => pv.venue.id);
    
    // Update the venue_id in the form if venues are available
    if (venueIds.length > 0) {
      form.setValue('venue_id', venueIds[0]);
    }
  };

  if (isPackagesError || isVenuesError) {
    return <div className="text-red-500">Error loading packages or venues</div>;
  }

  // Filter and rename packages
  const displayPackages = packages?.filter(pkg => 
    ['full_package', 'medium_package', 'venue_only'].includes(pkg.package_type)
  ).map(pkg => ({
    ...pkg,
    displayName: pkg.package_type === 'full_package' ? 'Package One' :
                pkg.package_type === 'medium_package' ? 'Package Two' :
                'Package Three'
  }));

  // Filter out Package Two
  const filteredPackages = displayPackages?.filter(pkg => pkg.package_type !== 'medium_package');

  return (
    <FormField
      control={form.control}
      name="package_id"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select Package or Venue</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handlePackageSelection}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPackages?.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`relative cursor-pointer transition-all hover:border-primary ${
                        field.value === pkg.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{pkg.displayName}</h3>
                            <div className="text-lg text-muted-foreground">{formatPrice(pkg.base_price)}</div>
                          </div>
                          <RadioGroupItem value={pkg.id} />
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">
                          {pkg.package_type === 'venue_only' 
                            ? 'The Gallery (Pre-drinks or Ceremony)'
                            : pkg.description}
                        </p>
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