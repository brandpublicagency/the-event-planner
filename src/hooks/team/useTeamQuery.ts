import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // First, get the user's team membership
      const { data: userTeamMember, error: memberError } = await supabase
        .from('team_members')
        .select('team_id, role')
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        console.error('Error fetching team member:', memberError);
        return null;
      }

      if (!userTeamMember?.team_id) return null;

      // Then, get the team details and all its members
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
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
        `)
        .eq('id', userTeamMember.team_id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        return null;
      }

      return team;
    },
  });
};