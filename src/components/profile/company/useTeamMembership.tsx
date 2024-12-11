import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamMembership = () => {
  return useQuery({
    queryKey: ['team-membership'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          role,
          team:teams (
            id,
            name,
            company:companies (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching team membership:', error);
        return null;
      }

      return data;
    },
  });
};