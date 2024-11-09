import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
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
    queryKey: ['venue_availability', selectedVenue, selectedStatus, date],
    queryFn: async () => {
      let query = supabase
        .from('venue_availability')
        .select(`
          *,
          venue:venues(name),
          event:events(
            name,
            event_type,
            status,
            bride_name,
            groom_name
          )
        `)
        .gte('start_time', new Date(date!.getFullYear(), date!.getMonth(), 1).toISOString())
        .lte('end_time', new Date(date!.getFullYear(), date!.getMonth() + 1, 0).toISOString())
        .order('start_time');

      if (selectedVenue) {
        query = query.eq('venue_id', selectedVenue);
      }

      if (selectedStatus) {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'tentative':
        return 'bg-yellow-100 text-yellow-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Options</SheetTitle>
              <SheetDescription>
                Filter venue availability by venue and status
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Venue</label>
                <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                  <SelectTrigger>
                    <SelectValue placeholder="All venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All venues</SelectItem>
                    {venues?.map((venue) => (
                      <SelectItem key={venue.id} value={venue.id}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6" />
          <h3 className="text-lg font-medium">
            {profile?.full_name || "Your"} Calendar
          </h3>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[300px,1fr]">
          <div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">
              Availability for {format(date || new Date(), 'MMMM yyyy')}
            </h4>
            
            {availability?.length === 0 ? (
              <p className="text-muted-foreground">No bookings for this period</p>
            ) : (
              <div className="space-y-2">
                {availability?.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-md border p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{slot.venue?.name}</p>
                          <Badge variant="secondary" className={getStatusColor(slot.status || '')}>
                            {slot.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(slot.start_time), 'PPP')}
                        </p>
                        <p className="text-sm">
                          {format(new Date(slot.start_time), 'h:mm a')} - {format(new Date(slot.end_time), 'h:mm a')}
                        </p>
                        {slot.event && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">{slot.event.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {slot.event.event_type}
                              {slot.event.bride_name && slot.event.groom_name && (
                                <> • {slot.event.bride_name} & {slot.event.groom_name}</>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {slot.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{slot.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;