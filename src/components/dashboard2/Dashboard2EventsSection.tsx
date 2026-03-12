import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, CalendarDays, List, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useState } from "react";
import Dashboard2EventCard from "./Dashboard2EventCard";
import type { Event } from "@/types/event";
import { groupEventsByMonth } from "@/utils/eventUtils";

const Dashboard2EventsSection = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['dashboard2_upcoming_events'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase.
      from('events').
      select('*').
      eq('completed', false).
      is('deleted_at', null).
      gte('event_date', today.toISOString().split('T')[0]).
      order('event_date', { ascending: true }).
      limit(50);

      if (error) throw error;
      const allEvents = (data || []) as Event[];

      // Filter: all events in current month + first 2 from next month
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const currentMonthEvents = allEvents.filter((e) => {
        if (!e.event_date) return false;
        const d = new Date(e.event_date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      let nextMonthCount = 0;
      const nextMonthEvents = allEvents.filter((e) => {
        if (!e.event_date) return false;
        const d = new Date(e.event_date);
        const isNextMonth = !(d.getMonth() === currentMonth && d.getFullYear() === currentYear);
        if (isNextMonth && nextMonthCount < 2) {
          nextMonthCount++;
          return true;
        }
        return false;
      });

      return [...currentMonthEvents, ...nextMonthEvents];
    },
    refetchOnMount: true
  });

  const groupedEvents = Object.entries(groupEventsByMonth(events));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-border bg-muted/40">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/60 rounded-t-xl">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Upcoming Events</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-md border border-border bg-muted p-0.5">
            <button
              onClick={() => setView('list')}
              className={`rounded-sm p-1 transition-colors ${view === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}>
              
              <List className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`rounded-sm p-1 transition-colors ${view === 'calendar' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}>
              
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <Button
            onClick={() => navigate('/events/new')}
            size="sm"
            className="h-7 text-xs gap-1">
            
            <Plus className="h-3.5 w-3.5" />
            New Event
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ?
        <div className="space-y-3">
            {[...Array(4)].map((_, i) =>
          <Skeleton key={i} className="h-20 rounded-lg" />
          )}
          </div> :
        events.length === 0 ?
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CalendarDays className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">No upcoming events</p>
            <Button
            variant="outline"
            size="sm"
            className="mt-3 text-xs"
            onClick={() => navigate('/events/new')}>
            
              Create your first event
            </Button>
          </div> :
        view === 'list' ?
        <div className="space-y-5">
            {groupedEvents.map(([monthLabel, monthEvents]) =>
          <div key={monthLabel}>
                <div className="sticky top-0 z-10 pb-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {monthLabel}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {monthEvents.map((event: Event) =>
              <Dashboard2EventCard key={event.event_code} event={event} />
              )}
                </div>
              </div>
          )}
          </div> : (

        /* Simple calendar view — month grid showing event dots */
        <div className="space-y-5">
            {groupedEvents.map(([monthLabel, monthEvents]) =>
          <div key={monthLabel}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {monthLabel}
                </h4>
                <div className="space-y-1.5">
                  {monthEvents.map((event: Event) =>
              <button
                key={event.event_code}
                onClick={() => navigate(`/events/${event.event_code}`)}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-muted transition-colors">
                
                      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-md bg-muted text-foreground">
                        <span className="text-xs font-semibold leading-none">
                          {event.event_date ? format(new Date(event.event_date), 'dd') : '—'}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase">
                          {event.event_date ? format(new Date(event.event_date), 'MMM') : ''}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.event_type}</p>
                      </div>
                      {event.pax &&
                <span className="text-xs text-muted-foreground">{event.pax} guests</span>
                }
                    </button>
              )}
                </div>
              </div>
          )}
          </div>)
        }
      </div>
    </motion.div>);

};

export default Dashboard2EventsSection;