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
      
      // Get user's team membership with basic team info
      const { data: teamMember, error: memberError } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        console.error('Error fetching team member:', memberError);
        return null;
      }

      if (!teamMember?.teams) {
        console.log('User has no team membership');
        return null;
      }

      // Get all team members for this team
      const { data: allTeamMembers, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          profiles (
            full_name
          )
        `)
        .eq('team_id', teamMember.teams.id);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        return null;
      }

      // Combine the data
      return {
        ...teamMember.teams,
        role: teamMember.role,
        team_members: allTeamMembers
      };
    },
  });
};