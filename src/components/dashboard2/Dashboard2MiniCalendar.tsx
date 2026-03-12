import { useState, useMemo } from "react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, isToday, addMonths, subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const Dashboard2MiniCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const { data: eventDates } = useQuery({
    queryKey: ["dashboard2-calendar-events", format(monthStart, "yyyy-MM")],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("event_date")
        .gte("event_date", format(monthStart, "yyyy-MM-dd"))
        .lte("event_date", format(monthEnd, "yyyy-MM-dd"))
        .is("deleted_at", null);
      return (data || []).map((e) => e.event_date).filter(Boolean) as string[];
    },
  });

  const eventDateSet = useMemo(
    () => new Set(eventDates || []),
    [eventDates]
  );

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[10px] font-medium text-muted-foreground text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const hasEvent = eventDateSet.has(format(day, "yyyy-MM-dd"));

          return (
            <button
              key={day.toISOString()}
              onClick={() => navigate("/events")}
              className={`
                relative flex flex-col items-center justify-center h-8 text-xs rounded-md transition-colors
                ${!inMonth ? "text-muted-foreground/40" : "text-foreground"}
                ${today ? "bg-primary text-primary-foreground font-bold" : "hover:bg-accent"}
              `}
            >
              {format(day, "d")}
              {hasEvent && (
                <span
                  className={`absolute bottom-0.5 h-1 w-1 rounded-full ${
                    today ? "bg-primary-foreground" : "bg-primary"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard2MiniCalendar;
