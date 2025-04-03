
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTaskCount() {
  const { data: taskCount = 0 } = useQuery({
    queryKey: ['taskCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('tasks')
        .select('*', {
          count: 'exact',
          head: true
        })
        .eq('completed', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  return taskCount;
}
