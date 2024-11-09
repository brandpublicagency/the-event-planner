import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { format, addMonths } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [futureDate, setFutureDate] = useState<Date | undefined>(new Date());

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date');
      
      if (error) throw error;
      return data;
    },
  });

  const selectedDateEvents = events?.filter(
    (event) => date && format(new Date(event.event_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Generate year options (current year + 5 years)
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(futureDate || new Date());
    newDate.setFullYear(parseInt(year));
    setFutureDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(futureDate || new Date());
    newDate.setMonth(months.indexOf(month));
    setFutureDate(newDate);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-4">
              <Select onValueChange={handleMonthChange} defaultValue={months[new Date().getMonth()]}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleYearChange} defaultValue={new Date().getFullYear().toString()}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <CalendarComponent
              mode="single"
              selected={futureDate}
              onSelect={setFutureDate}
              className="rounded-md border"
              defaultMonth={futureDate}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
          </h3>
          <div className="space-y-4">
            {selectedDateEvents?.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.event_date), 'h:mm a')}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  event.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
            {(!selectedDateEvents || selectedDateEvents.length === 0) && (
              <p className="text-muted-foreground">No events scheduled for this date.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;