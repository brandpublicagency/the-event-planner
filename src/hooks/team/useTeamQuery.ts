import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      console.log('Fetching team data...');
      
      // First get the authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        return null;
      }

      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Authenticated user:', user.id);
      
      // Get team membership for the current user
      const { data: userTeamMember, error: memberError } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          team:teams (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        console.error('Error fetching team membership:', memberError);
        return null;
      }

      if (!userTeamMember?.team) {
        console.log('User has no team membership');
        return null;
      }

      // Then get all members for this team
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          profiles (
            full_name
          )
        `)
        .eq('team_id', userTeamMember.team.id);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        return null;
      }

      // Return combined data
      return {
        id: userTeamMember.team.id,
        name: userTeamMember.team.name,
        role: userTeamMember.role,
        team_members: members
      };
    },
  });
};