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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('ZAR', 'R');
  };

  const handlePackageSelection = async (packageId: string) => {
    const selectedPackage = packages?.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      console.error('Selected package not found');
      return;
    }

    form.setValue('package_id', packageId);
    
    const venueIds = selectedPackage.package_venues.map((pv: any) => pv.venue.id);
    
    if (venueIds.length > 0) {
      form.setValue('venue_id', venueIds[0]);
    }
  };

  if (isPackagesError) {
    return <div className="text-red-500">Error loading packages</div>;
  }

  const mainPackages = packages?.filter(pkg => ['full_package', 'medium_package'].includes(pkg.package_type))
    .sort((a, b) => {
      const order = { 'full_package': 1, 'medium_package': 2 };
      return order[a.package_type as keyof typeof order] - order[b.package_type as keyof typeof order];
    });

  const venuePackages = packages?.filter(pkg => pkg.package_type === 'venue_only');

  return (
    <FormField
      control={form.control}
      name="package_id"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel>Select Package or Venue</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handlePackageSelection}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              {/* Main Packages */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mainPackages?.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`relative cursor-pointer transition-all hover:border-primary ${
                        field.value === pkg.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {pkg.package_type === 'full_package' ? 'Package One' : 'Package Two'}
                            </h3>
                            <div className="text-lg text-muted-foreground">{formatPrice(pkg.base_price)}</div>
                          </div>
                          <RadioGroupItem value={pkg.id} />
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">{pkg.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Standalone Venues */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Standalone Venues</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {venuePackages?.map((pkg) => (
                      <Card 
                        key={pkg.id}
                        className={`relative cursor-pointer transition-all hover:border-primary ${
                          field.value === pkg.id ? 'border-primary' : ''
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{pkg.name}</h3>
                              <div className="text-lg text-muted-foreground">{formatPrice(pkg.base_price)}</div>
                            </div>
                            <RadioGroupItem value={pkg.id} />
                          </div>
                          {pkg.description && (
                            <p className="text-muted-foreground text-sm mt-2">{pkg.description}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
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