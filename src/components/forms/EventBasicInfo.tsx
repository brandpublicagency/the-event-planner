import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventTypeSelect } from "./EventTypeSelect";
import { EventDateSelect } from "./EventDateSelect";
import { VenueSelect } from "./VenueSelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
}

const EventBasicInfo = ({ form }: EventBasicInfoProps) => {
  const { toast } = useToast();

  const { data: packages, error: packagesError, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*');
        
        if (error) {
          toast({
            title: "Error fetching packages",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data || [];
      } catch (error: any) {
        console.error('Error fetching packages:', error);
        throw error;
      }
    },
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return (
    <div className="space-y-6">
      <EventTypeSelect form={form} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Count</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <EventDateSelect form={form} />
      </div>

      {packagesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load packages. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      <FormField
        control={form.control}
        name="package_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading packages..." : "Select package"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {packages?.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <VenueSelect form={form} />
    </div>
  );
};

export default EventBasicInfo;