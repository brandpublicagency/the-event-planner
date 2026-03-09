import { useProfile } from "@/hooks/useProfile";
import { useTaskContext } from "@/contexts/TaskContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Dashboard2Greeting = () => {
  const { profile, isLoading: profileLoading } = useProfile();
  const { tasks } = useTaskContext();

  const { data: eventsThisMonth = 0 } = useQuery({
    queryKey: ['dashboard2_events_count'],
    queryFn: async () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const { count, error } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null)
        .gte('event_date', startOfMonth)
        .lte('event_date', endOfMonth);

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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 mb-2"
    >
      <h1 className="text-xl font-semibold text-foreground tracking-tight">
        {getGreeting()}, {firstName}
      </h1>
      <div className="flex items-center gap-1.5 mt-1">
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
            <span className="text-xs text-destructive font-medium">
              {highPriority} high priority
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard2Greeting;
