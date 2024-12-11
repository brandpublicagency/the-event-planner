import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      console.log('Fetching team data...');
      
      // First get the team membership for the current user
      const { data: teamMember, error: memberError } = await supabase
        .from('team_members')
        .select('team_id, role')
        .single();

      if (memberError) {
        console.error('Error fetching team member:', memberError);
        return null;
      }

      if (!teamMember?.team_id) {
        console.log('User has no team membership');
        return null;
      }

      // Then get the team details and its members
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          team_members!inner (
            id,
            user_id,
            role,
            profiles!inner (
              full_name
            )
          )
        `)
        .eq('id', teamMember.team_id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        return null;
      }

      console.log('Team data:', team);
      return team;
    },
  });
};