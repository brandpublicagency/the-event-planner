import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import CalendarFilters from "@/components/calendar/CalendarFilters";
import AvailabilityList from "@/components/calendar/AvailabilityList";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVenue, setSelectedVenue] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      // Mock data
      return {
        full_name: "Demo User"
      };
    },
  });

  const { data: venues } = useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      // Mock venue data
      return [
        { id: '1', name: 'Venue A' },
        { id: '2', name: 'Venue B' }
      ];
    },
  });

  const { data: availability } = useQuery({
    queryKey: ['venue_availability', selectedVenue, selectedStatus, date],
    queryFn: async () => {
      // Mock availability data
      return [
        {
          id: '1',
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          venue: { name: 'Venue A' },
          event: {
            name: 'Sample Event',
            event_type: 'Wedding',
            status: 'Confirmed',
            bride_name: 'Jane',
            groom_name: 'John'
          }
        }
      ];
    },
  });

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <CalendarFilters
          venues={venues}
          selectedVenue={selectedVenue}
          setSelectedVenue={setSelectedVenue}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </div>
      
      <Card className="p-6 glassmorphism">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-white" />
          <h3 className="text-lg font-medium text-white">
            {profile?.full_name || "Your"} Calendar
          </h3>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[300px,1fr]">
          <div>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-0"
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-white">
              Availability for {format(date || new Date(), "MMMM yyyy")}
            </h4>
            
            <AvailabilityList 
              availability={availability?.map(item => ({
                ...item,
                start_time: format(new Date(item.start_time), "dd MMMM yyyy"),
                end_time: format(new Date(item.end_time), "dd MMMM yyyy")
              })) || []} 
              getStatusColor={getStatusColor}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;