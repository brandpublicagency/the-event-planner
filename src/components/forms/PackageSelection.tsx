import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";

interface PackageSelectionProps {
  form: UseFormReturn<any>;
}

// Mock data for demonstration
const mockPackages = [
  {
    id: "1",
    name: "Basic Package",
    description: "Perfect for small events",
    base_price: 1000,
    package_venues: [
      { venue: { name: "Main Hall" } }
    ]
  },
  {
    id: "2",
    name: "Premium Package",
    description: "Ideal for medium-sized events",
    base_price: 2000,
    package_venues: [
      { venue: { name: "Main Hall" } },
      { venue: { name: "Garden" } }
    ]
  }
];

const PackageSelection = ({ form }: PackageSelectionProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('ZAR', 'R');
  };

  const getVenueNames = (packageVenues: any[]) => {
    return packageVenues
      .map(pv => pv.venue.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .join(', ');
  };

  const handlePackageSelection = async (packageId: string) => {
    const selectedPackage = mockPackages?.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      console.error('Selected package not found');
      return;
    }

    form.setValue('package_id', packageId);
    
    // Set the first venue as default
    const venueIds = selectedPackage.package_venues.map((pv: any) => pv.venue.id);
    if (venueIds.length > 0) {
      form.setValue('venue_id', venueIds[0]);
    }
  };

  return (
    <FormField
      control={form.control}
      name="package_id"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel>Select Package</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handlePackageSelection}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockPackages?.map((pkg) => (
                    <Card 
                      key={pkg.id}
                      className={`relative cursor-pointer transition-all hover:border-primary ${
                        field.value === pkg.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {pkg.name}
                            </h3>
                            <div className="text-lg font-semibold text-primary">{formatPrice(pkg.base_price)}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {getVenueNames(pkg.package_venues)}
                            </div>
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
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PackageSelection;