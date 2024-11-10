import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventTypeSelect } from "./EventTypeSelect";
import { EventDateSelect } from "./EventDateSelect";
import { VenueSelect } from "./VenueSelect";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
}

const PACKAGES = [
  { id: 'package_1', name: 'Package 1' },
  { id: 'package_2', name: 'Package 2' },
  { id: 'package_3', name: 'Package 3' },
  { id: 'none', name: 'None' },
];

const EventBasicInfo = ({ form }: EventBasicInfoProps) => {
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

      <FormField
        control={form.control}
        name="package"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PACKAGES.map((pkg) => (
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