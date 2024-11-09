import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users } from "lucide-react";

interface PackageSelectionProps {
  form: UseFormReturn<any>;
}

const PackageSelection = ({ form }: PackageSelectionProps) => {
  const { data: packages } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          package_venues:package_venues(
            venues:venues(*)
          )
        `)
        .order('base_price');
      
      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  return (
    <FormField
      control={form.control}
      name="package_id"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select Package</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
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
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatPrice(pkg.base_price)}
                        <span className="text-sm font-normal text-muted-foreground ml-1">excl. VAT</span>
                      </div>
                      {pkg.discount_percentage > 0 && (
                        <Badge variant="secondary" className="mt-1">
                          Save {pkg.discount_percentage}%
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {pkg.package_venues?.map(pv => pv.venues?.name).join(', ')}
                        </span>
                      </div>
                      
                      {pkg.max_guests && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Up to {pkg.max_guests} guests</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PackageSelection;