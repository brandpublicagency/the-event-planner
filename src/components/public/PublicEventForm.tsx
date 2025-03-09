
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { EventFormData } from "@/types/eventForm";
import { publicEventFormSchema } from "@/schemas/publicEventFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { createEvent } from "@/services/eventService";

// Form components
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

// These values MUST match exactly what's expected in the database trigger
const VENUE_OPTIONS = [
  "The Kitchen",
  "The Gallery",
  "The Grand Hall",
  "Package 1",
  "Package 2",
  "Package 3"
];

export default function PublicEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  
  const form = useForm<EventFormData>({
    resolver: zodResolver(publicEventFormSchema),
    defaultValues: {
      event_type: 'Wedding',
      venues: []
    }
  });

  const eventType = form.watch("event_type");
  const venues = form.watch("venues") || [];

  const handleVenueChange = (venue: string, checked: boolean) => {
    const currentVenues = [...venues];
    
    if (checked && !currentVenues.includes(venue)) {
      currentVenues.push(venue);
    } else if (!checked && currentVenues.includes(venue)) {
      const index = currentVenues.indexOf(venue);
      currentVenues.splice(index, 1);
    }
    
    form.setValue("venues", currentVenues, { shouldValidate: true });
  };

  const generateEventCode = () => {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    return `EVENT-${format(date, 'ddMM')}-${timestamp}`;
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setErrorMessage("");
    
    try {
      const eventCode = generateEventCode();
      
      // Prepare the event data
      const eventData = {
        event_code: eventCode,
        name: data.name,
        description: data.description || null,
        event_type: data.event_type,
        event_date: data.event_date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        pax: data.pax || null,
        completed: false,
        venues: data.venues || [],
        
        // Contact fields
        primary_name: data.primary_name || null,
        primary_phone: data.primary_phone || null,
        primary_email: data.primary_email || null,
        secondary_name: data.secondary_name || null,
        secondary_phone: data.secondary_phone || null,
        secondary_email: data.secondary_email || null,
        address: data.address || null,
        company: data.company || null,
        vat_number: data.vat_number || null
      };

      await createEvent(eventData);
      setSubmissionStatus('success');
      form.reset();
    } catch (error: any) {
      console.error('Error creating event:', error);
      setSubmissionStatus('error');
      setErrorMessage(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-4">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
          <p className="text-gray-600">Your event has been successfully submitted. We'll be in touch soon!</p>
          <Button 
            onClick={() => {
              setSubmissionStatus('idle');
              form.reset();
            }}
            className="mt-4"
          >
            Submit Another Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Event Booking Request</h1>
        <p className="text-gray-600 mt-2">Please fill out the form below to request a booking at Warm Karoo.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="event_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                      <SelectItem value="Celebration">Celebration</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Private Event">Private Event</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide a brief description of your event" 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Guest Count</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of guests"
                        className="bg-white"
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField 
                control={form.control} 
                name="event_date" 
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full h-10 px-3 py-2 text-left font-normal rounded-md border border-input bg-background", !field.value && "text-muted-foreground")}>
                            {field.value ? format(new Date(field.value), "dd MMMM yyyy") : <span>Select a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={field.value ? new Date(field.value) : undefined} 
                          onSelect={date => {
                            if (date) {
                              const currentDate = field.value ? new Date(field.value) : new Date();
                              date.setHours(currentDate.getHours(), currentDate.getMinutes());
                              field.onChange(date.toISOString());
                            }
                          }} 
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus 
                          className="rounded-md border border-input bg-background" 
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <FormLabel>Venue Preferences</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {VENUE_OPTIONS.map((venue) => (
                  <div key={venue} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`venue-${venue}`}
                      checked={venues.includes(venue)}
                      onChange={(e) => handleVenueChange(venue, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label 
                      htmlFor={`venue-${venue}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {venue}
                    </label>
                  </div>
                ))}
              </div>
              {form.formState.errors.venues && (
                <p className="text-sm font-medium text-red-500">
                  {form.formState.errors.venues.message}
                </p>
              )}
            </div>

            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold mb-4">
                {eventType === 'Wedding' ? 'Couple Information' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{eventType === 'Wedding' ? "Bride's Name" : "Contact Person"}</FormLabel>
                        <FormControl>
                          <Input placeholder={eventType === 'Wedding' ? "Bride's full name" : "Contact person's name"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {eventType === 'Wedding' && (
                    <FormField
                      control={form.control}
                      name="secondary_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Groom's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Groom's full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{eventType === 'Wedding' ? "Bride's Email" : "Email Address"}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={eventType === 'Wedding' ? "Bride's email address" : "Email address"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {eventType === 'Wedding' && (
                    <FormField
                      control={form.control}
                      name="secondary_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Groom's Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Groom's email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{eventType === 'Wedding' ? "Bride's Phone" : "Phone Number"}</FormLabel>
                        <FormControl>
                          <Input placeholder={eventType === 'Wedding' ? "Bride's phone number" : "Phone number"} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {eventType === 'Wedding' && (
                    <FormField
                      control={form.control}
                      name="secondary_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Groom's Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Groom's phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {eventType !== 'Wedding' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vat_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VAT Number</FormLabel>
                          <FormControl>
                            <Input placeholder="VAT number (if applicable)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Full address" 
                          {...field} 
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {submissionStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 mb-4">
              {errorMessage || "There was an error submitting your event. Please try again."}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : "Submit Event Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
