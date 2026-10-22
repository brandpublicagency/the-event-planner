import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTaskContext } from "@/contexts/TaskContext";

import { CalendarDays, Users, ListTodo, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInCalendarDays, endOfMonth, format, parseISO, startOfMonth } from "date-fns";

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  to: string;
}

const KPICard = ({ icon: Icon, label, value, subtitle, to }: KPICardProps) => (
  <Link
    to={to}
    className="group rounded-lg border border-border bg-card px-3 py-3 min-h-[76px] transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="flex items-center justify-between gap-1.5 mb-1">
      <span className="flex items-center gap-1.5 min-w-0">
        <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs text-muted-foreground font-medium truncate">{label}</span>
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </div>
    <p className="text-xl font-semibold text-foreground tracking-tight tabular-nums">{value}</p>
    {subtitle && (
      <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
    )}
  </Link>
);

const DashboardKPIStrip = () => {
  const { tasks } = useTaskContext();

  const { data: monthlyData, isLoading } = useQuery({
    queryKey: ['dashboard_kpi'],
    queryFn: async () => {
      const now = new Date();
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
      const today = format(now, 'yyyy-MM-dd');

      const [eventsRes, nextEventRes] = await Promise.all([
        supabase
          .from('events')
          .select('pax')
          .is('deleted_at', null)
          .gte('event_date', monthStart)
          .lte('event_date', monthEnd),
        supabase
          .from('events')
          .select('event_date, name, event_code')
          .is('deleted_at', null)
          .eq('completed', false)
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(1),
      ]);

      const events = eventsRes.data || [];
      const totalGuests = events.reduce((sum, e) => sum + (e.pax || 0), 0);
      const nextEvent = nextEventRes.data?.[0] || null;

      return {
        eventsCount: events.length,
        totalGuests,
        nextEvent,
      };
    },
  });

  const pendingTasks = tasks.filter(t => !t.completed).length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[76px] rounded-lg" />
        ))}
      </div>
    );
  }

  const getCountdown = () => {
    const next = monthlyData?.nextEvent;
    if (!next?.event_date) return { value: '—', subtitle: 'No upcoming events' };
    const days = differenceInCalendarDays(parseISO(next.event_date), new Date());
    if (days <= 0) return { value: 'Today', subtitle: next.name };
    if (days === 1) return { value: 'Tomorrow', subtitle: next.name };
    return { value: `${days} days`, subtitle: next.name };
  };

  const countdown = getCountdown();

  const nextEventCode = monthlyData?.nextEvent?.event_code;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4">
      <KPICard
        icon={CalendarDays}
        label="Events this month"
        value={monthlyData?.eventsCount ?? 0}
        subtitle={format(new Date(), 'MMMM')}
        to="/calendar"
      />
      <KPICard
        icon={Users}
        label="Total guests"
        value={(monthlyData?.totalGuests ?? 0).toLocaleString()}
        subtitle="This month"
        to="/events"
      />
      <KPICard
        icon={ListTodo}
        label="Pending tasks"
        value={pendingTasks}
        subtitle={pendingTasks === 0 ? "All caught up" : "Open in Tasks"}
        to="/tasks"
      />
      <KPICard
        icon={Clock}
        label="Next event"
        value={countdown.value}
        subtitle={countdown.subtitle}
        to={nextEventCode ? `/events/${nextEventCode}` : "/events"}
      />
    </div>
  );
};

export default DashboardKPIStrip;
