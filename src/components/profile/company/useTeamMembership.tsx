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

      console.log('Authenticated user:', user.id);

      // Get team membership for the current user
      const { data: membership, error: membershipError } = await supabase
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
        .maybeSingle();

      if (membershipError) {
        console.error('Error fetching team membership:', membershipError);
        throw membershipError;
      }

      if (!membership) {
        console.log('No team membership found');
        return null;
      }

      console.log('Team membership found:', membership);

      return {
        role: membership.role,
        team: membership.team
      };
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};