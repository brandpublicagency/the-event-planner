import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
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
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </div>

        <div className="bg-white rounded-lg p-8">
          <div className="flex gap-4 mb-6 justify-center">
            <Select 
              onValueChange={handleMonthChange} 
              defaultValue={months[futureDate?.getMonth() || 0]}
            >
              <SelectTrigger className="w-[180px] bg-white border-zinc-200 hover:bg-zinc-50 transition-colors">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {months.map((month) => (
                  <SelectItem 
                    key={month} 
                    value={month}
                    className="hover:bg-zinc-50 cursor-pointer"
                  >
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              onValueChange={handleYearChange} 
              defaultValue={futureDate?.getFullYear().toString()}
            >
              <SelectTrigger className="w-[120px] bg-white border-zinc-200 hover:bg-zinc-50 transition-colors">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {years.map((year) => (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    className="hover:bg-zinc-50 cursor-pointer"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center">
            <CalendarComponent
              mode="single"
              selected={futureDate}
              onSelect={setFutureDate}
              className="rounded-md"
              defaultMonth={futureDate}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Events for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
        </h3>
        <div className="space-y-4">
          {selectedDateEvents?.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              <div>
                <h4 className="font-medium">{event.name}</h4>
                <p className="text-sm text-zinc-500">
                  {format(new Date(event.event_date), 'h:mm a')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                event.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                'bg-zinc-100 text-zinc-800'
              }`}>
                {event.status}
              </span>
            </div>
          ))}
          {(!selectedDateEvents || selectedDateEvents.length === 0) && (
            <p className="text-zinc-500">No events scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;