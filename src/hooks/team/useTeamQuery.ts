import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teamMember, error: teamError } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams (
            id,
            name,
            team_members (
              id,
              user_id,
              role,
              profiles (
                full_name
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        return null;
      }

      return teamMember?.teams;
    },
  });
};