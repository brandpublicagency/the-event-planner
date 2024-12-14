import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamMembership = () => {
  return useQuery({
    queryKey: ['team-membership'],
    queryFn: async () => {
      console.log('Fetching team membership...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      // First get the team membership
      const { data: membership, error: membershipError } = await supabase
        .from('team_members')
        .select('role, team_id')
        .eq('user_id', user.id)
        .single();

      if (membershipError) {
        console.error('Error fetching team membership:', membershipError);
        throw membershipError;
      }

      if (!membership) {
        console.log('No team membership found');
        return null;
      }

      // Then get the team and company details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          company:companies (
            id,
            name
          )
        `)
        .eq('id', membership.team_id)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        throw teamError;
      }

      return {
        role: membership.role,
        team: teamData
      };
    },
  });
};