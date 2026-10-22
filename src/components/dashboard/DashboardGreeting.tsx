import { useProfile } from "@/hooks/useProfile";
import { useTaskContext } from "@/contexts/TaskContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardGreeting = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { tasks } = useTaskContext();

  const { data: eventsThisMonth = 0 } = useQuery({
    queryKey: ['dashboard_events_count'],
    queryFn: async () => {
      const now = new Date();
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)
        .gte('event_date', monthStart)
        .lte('event_date', monthEnd);

      if (error) throw error;
      return count || 0;
    },
  });

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (profileLoading) {
    return (
      <div className="mt-4 mb-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
    );
  }

  const firstName = profile?.full_name || 'there';

  return (
    <div className="mt-4 mb-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">
        {getGreeting()}, {firstName}
      </h1>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1">
        <span className="text-xs text-muted-foreground">
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">
          {eventsThisMonth} event{eventsThisMonth !== 1 ? 's' : ''} this month
        </span>
        <span className="text-xs text-muted-foreground">·</span>
        <span className="text-xs text-muted-foreground">
          {pendingTasks} task{pendingTasks !== 1 ? 's' : ''} pending
        </span>
        {highPriority > 0 && (
          <>
            <span className="text-xs text-muted-foreground">·</span>
            <Link to="/tasks" className="text-xs text-destructive font-medium hover:underline">
              {highPriority} high priority
            </Link>
          </>
        )}
      </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button asChild size="sm" variant="outline" className="h-9">
          <Link to="/tasks/new"><Plus className="h-4 w-4" />New task</Link>
        </Button>
        <Button asChild size="sm" className="h-9">
          <Link to="/events/new"><Plus className="h-4 w-4" />New event</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardGreeting;
