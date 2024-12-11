import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      console.log('Fetching team data...');
      
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
      
      // First, get the teams the user belongs to
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          team_members!inner (
            role
          )
        `)
        .eq('team_members.user_id', user.id)
        .single();

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        return null;
      }

      if (!teams) {
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
        .eq('team_id', teams.id);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        return null;
      }

      // Combine the data
      return {
        id: teams.id,
        name: teams.name,
        role: teams.team_members[0].role,
        team_members: members
      };
    },
  });
};