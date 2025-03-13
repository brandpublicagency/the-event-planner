
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
interface EventDateSelectProps {
  form: UseFormReturn<any>;
}
export const EventDateSelect = ({
  form
}: EventDateSelectProps) => {
  return <FormField control={form.control} name="event_date" render={({
    field
  }) => <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className={cn("w-full h-10 px-3 py-2 text-left font-normal rounded-md border border-input bg-background", !field.value && "text-muted-foreground")}>
                  {field.value ? format(new Date(field.value), "dd MMMM yyyy") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={date => {
          if (date) {
            const currentDate = field.value ? new Date(field.value) : new Date();
            date.setHours(currentDate.getHours(), currentDate.getMinutes());
            field.onChange(date.toISOString());
          }
        }} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="rounded-md border border-input bg-background" />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>} />;
};
