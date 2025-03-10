
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refreshEvents = () => {
    queryClient.invalidateQueries({ queryKey: ['events', currentDate.getMonth(), currentDate.getFullYear()] });
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get all days of the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for the current month
  const { data: events = [], isLoading: isEventsLoading, error: eventsError } = useQuery({
    queryKey: ['events', currentDate.getMonth(), currentDate.getFullYear()],
    queryFn: async () => {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      let query = supabase
        .from('events')
        .select(`*`)
        .gte('event_date', start.toISOString())
        .lte('event_date', end.toISOString())
        .order('event_date');

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error loading events",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (eventsError) {
    toast({
      title: "Error loading events",
      description: "Please try again later",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <Header
        pageTitle={format(currentDate, "MMMM yyyy")}
      />
      
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={previousMonth}
              className="rounded-full h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={goToToday}
              className="rounded-full px-4 h-8"
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={nextMonth}
              className="rounded-full h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={() => navigate('/events/new')}
            className="rounded-full h-8 px-4 bg-black text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4 mr-2" /> New Event
          </Button>
        </div>

        <CalendarGrid 
          currentDate={currentDate}
          events={events}
          isLoading={isEventsLoading}
        />
      </div>
    </div>
  );
};

export default Calendar;
