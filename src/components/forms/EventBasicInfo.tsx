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
import { EventFormData } from "@/types/eventForm";

const generateTimeOptions = (start: number, end: number) => {
  const options = [];
  for (let hour = start; hour <= end; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    options.push(time);
  }
  return options;
};

const startTimeOptions = generateTimeOptions(6, 20);
const endTimeOptions = generateTimeOptions(9, 23);

interface EventBasicInfoProps {
  form: UseFormReturn<EventFormData>;
}

const EventBasicInfo = ({ form }: EventBasicInfoProps) => {
  const { toast } = useToast();

  const { data: packages, error: packagesError, isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
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
    },
  });

  return (
    <div className="space-y-6">
      <EventTypeSelect form={form} />

      <div className="grid gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Event Name" {...field} className="bg-white" />
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
                <Input 
                  type="number" 
                  className="bg-white"
                  {...field} 
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <EventDateSelect form={form} />
          </div>

          <div className="col-span-1">
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startTimeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1">
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {endTimeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className="bg-white">
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