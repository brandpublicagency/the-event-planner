import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: availability, refetch: refetchAvailability } = useQuery({
    queryKey: ['venue_availability', selectedVenue, date],
    enabled: !!selectedVenue && !!date,
    queryFn: async () => {
      const startOfDay = new Date(date!);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date!);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('venue_availability')
        .select(`
          *,
          event:events(
            name,
            event_type,
            status
          )
        `)
        .eq('venue_id', selectedVenue)
        .gte('start_time', startOfDay.toISOString())
        .lte('end_time', endOfDay.toISOString())
        .order('start_time');
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('venue_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'venue_availability',
          filter: selectedVenue ? `venue_id=eq.${selectedVenue}` : undefined,
        },
        (payload) => {
          toast({
            title: "Availability Updated",
            description: "The venue's availability has been updated.",
          });
          refetchAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedVenue, refetchAvailability, toast]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      </div>
      
      <div className="grid gap-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-6 w-6" />
            <h3 className="text-lg font-medium">
              {profile?.full_name || "Your"} Calendar
            </h3>
          </div>

          <div className="mt-6 space-y-6">
            <Select value={selectedVenue} onValueChange={setSelectedVenue}>
              <SelectTrigger>
                <SelectValue placeholder="Select a venue" />
              </SelectTrigger>
              <SelectContent>
                {venues?.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            {selectedVenue && date && (
              <div className="space-y-4">
                <h4 className="font-medium">Availability for {format(date, 'PPP')}</h4>
                {availability?.length === 0 ? (
                  <p className="text-muted-foreground">No bookings for this date</p>
                ) : (
                  <div className="space-y-2">
                    {availability?.map((slot) => (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-md ${
                          slot.status === 'available' ? 'bg-green-50' :
                          slot.status === 'tentative' ? 'bg-yellow-50' :
                          slot.status === 'booked' ? 'bg-blue-50' :
                          'bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {format(new Date(slot.start_time), 'h:mm a')} - {format(new Date(slot.end_time), 'h:mm a')}
                            </p>
                            {slot.event && (
                              <p className="text-sm text-muted-foreground">
                                {slot.event.name} ({slot.event.event_type})
                              </p>
                            )}
                          </div>
                          <span className="px-2 py-1 text-sm rounded-full capitalize bg-white">
                            {slot.status}
                          </span>
                        </div>
                        {slot.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">{slot.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;