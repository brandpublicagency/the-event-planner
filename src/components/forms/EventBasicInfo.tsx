import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventTypeSelect } from "./EventTypeSelect";
import { EventDateSelect } from "./EventDateSelect";
import { VenueSelect } from "./VenueSelect";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import OpenAI from "openai";
import { useToast } from "@/components/ui/use-toast";

interface EventBasicInfoProps {
  form: UseFormReturn<any>;
}

const PACKAGES = [
  { id: 'package_1', name: 'Package 1' },
  { id: 'package_2', name: 'Package 2' },
  { id: 'package_3', name: 'Package 3' },
  { id: 'none', name: 'None' },
];

const openai = import.meta.env.VITE_OPENAI_API_KEY 
  ? new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    })
  : null;

const EventBasicInfo = ({ form }: EventBasicInfoProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateEventName = async () => {
    if (!openai) {
      toast({
        title: "Error",
        description: "OpenAI API key not configured",
        variant: "destructive"
      });
      return;
    }

    const eventType = form.getValues("event_type");
    const brideName = form.getValues("bride_name");
    const groomName = form.getValues("groom_name");
    const companyName = form.getValues("company_name");

    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a creative event planner. Generate a catchy and appropriate event name."
          },
          {
            role: "user",
            content: `Generate a creative name for a ${eventType} event.${
              eventType === "Wedding" 
                ? ` The bride's name is ${brideName || 'TBD'} and the groom's name is ${groomName || 'TBD'}.`
                : companyName 
                  ? ` The company name is ${companyName}.`
                  : ''
            } Keep it under 50 characters.`
          }
        ],
        model: "gpt-4o",
      });

      const suggestedName = completion.choices[0]?.message?.content;
      if (suggestedName) {
        form.setValue("name", suggestedName);
        toast({
          title: "Success",
          description: "Generated event name suggestion"
        });
      }
    } catch (error) {
      console.error('Error generating event name:', error);
      toast({
        title: "Error",
        description: "Failed to generate event name",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <EventTypeSelect form={form} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="Event Name" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateEventName}
                    disabled={isGenerating}
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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