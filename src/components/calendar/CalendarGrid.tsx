
import React from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  eachWeekOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  parseISO,
  addDays
} from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { CalendarEvent } from "@/components/calendar/CalendarEvent";
import type { Event } from "@/types/event";

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  isLoading: boolean;
}

// Array of weekday names
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, isLoading }) => {
  // Calculate the first day of the month
  const monthStart = startOfMonth(currentDate);
  
  // Calculate the last day of the month
  const monthEnd = endOfMonth(currentDate);
  
  // Get all weeks that include days from the current month
  const monthWeeks = eachWeekOfInterval(
    { start: monthStart, end: monthEnd },
    { weekStartsOn: 1 } // Week starts on Monday
  );

  // For each week, get all days
  const calendarDays = monthWeeks.map(weekStart => {
    const week = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(weekStart, { weekStartsOn: 1 })
    });
    return week;
  });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      if (!event.event_date) return false;
      const eventDate = parseISO(event.event_date);
      return isSameDay(eventDate, day);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="calendar-grid h-full flex flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-sm font-medium text-muted-foreground border-b py-2 px-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const dayNumber = format(day, "d");
              const monthLabel = !isSameMonth(day, currentDate) ? 
                format(day, " MMM") : "";
              
              return (
                <div 
                  key={dayIndex}
                  className={cn(
                    "p-1 border-r last:border-r-0 border-zinc-200 overflow-hidden",
                    isCurrentMonth ? "bg-white" : "bg-zinc-50",
                    isCurrentDay && "bg-blue-50",
                    weekIndex > 0 && "border-t border-zinc-200"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "text-sm font-medium p-1",
                      isCurrentMonth ? "text-zinc-900" : "text-zinc-400",
                      isCurrentDay && "bg-blue-100 rounded-full h-7 w-7 flex items-center justify-center"
                    )}>
                      {dayNumber}{monthLabel}
                    </div>
                  </div>
                  
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[100px]">
                    {dayEvents.map((event) => (
                      <CalendarEvent key={event.event_code} event={event} />
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
