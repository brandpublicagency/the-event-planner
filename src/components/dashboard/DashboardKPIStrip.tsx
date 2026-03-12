import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTaskContext } from "@/contexts/TaskContext";

import { CalendarDays, Users, ListTodo, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays, differenceInHours } from "date-fns";

interface KPICardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  delay: number;
}

const KPICard = ({ icon: Icon, label, value, subtitle, delay }: KPICardProps) => (
  <div className="rounded-lg border border-border bg-card px-3 py-2.5 hover:border-foreground/30 transition-colors">
  >
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
    </div>
    <p className="text-lg font-semibold text-foreground tracking-tight">{value}</p>
    {subtitle && (
      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>
    )}
  </motion.div>
);

const DashboardKPIStrip = () => {
  const { tasks } = useTaskContext();

  const { data: monthlyData, isLoading } = useQuery({
    queryKey: ['dashboard_kpi'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      const today = now.toISOString().split('T')[0];

      const [eventsRes, nextEventRes] = await Promise.all([
        supabase
          .from('events')
          .select('pax')
          .is('deleted_at', null)
          .gte('event_date', startOfMonth)
          .lte('event_date', endOfMonth),
        supabase
          .from('events')
          .select('event_date, name')
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-16 rounded-lg" />
      </div>
    );
  }

  const getCountdown = () => {
    if (!monthlyData?.nextEvent?.event_date) return { value: '—', subtitle: 'No upcoming events' };
    const eventDate = new Date(monthlyData.nextEvent.event_date);
    const now = new Date();
    const days = differenceInDays(eventDate, now);
    if (days > 0) return { value: `${days}d`, subtitle: monthlyData.nextEvent.name };
    const hours = differenceInHours(eventDate, now);
    if (hours > 0) return { value: `${hours}h`, subtitle: monthlyData.nextEvent.name };
    return { value: 'Today', subtitle: monthlyData.nextEvent.name };
  };

  const countdown = getCountdown();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      <div className="lg:col-span-2 grid grid-cols-3 gap-4">
        <KPICard
          icon={CalendarDays}
          label="Events This Month"
          value={monthlyData?.eventsCount ?? 0}
          delay={0}
        />
        <KPICard
          icon={Users}
          label="Total Guests"
          value={monthlyData?.totalGuests ?? 0}
          subtitle="This month"
          delay={0.05}
        />
        <KPICard
          icon={ListTodo}
          label="Pending Tasks"
          value={pendingTasks}
          delay={0.1}
        />
      </div>
      <KPICard
        icon={Clock}
        label="Next Event"
        value={countdown.value}
        subtitle={countdown.subtitle}
        delay={0.15}
      />
    </div>
  );
};

export default DashboardKPIStrip;
