import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamData, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      console.log('Fetching team data...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      // Get user's team membership and team details in a single query
      const { data: teamMember, error: memberError } = await supabase
        .from('team_members')
        .select(`
          role,
          team:teams (
            id,
            name,
            company_id
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (memberError) {
        console.error('Error fetching team:', memberError);
        return null;
      }

      if (!teamMember?.team) {
        console.log('User has no team');
        return null;
      }

      // Get all team members in a separate query
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          role,
          profiles:profiles (
            full_name,
            surname,
            mobile
          )
        `)
        .eq('team_id', teamMember.team.id);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        throw membersError;
      }

      return {
        id: teamMember.team.id,
        name: teamMember.team.name,
        company_id: teamMember.team.company_id,
        role: teamMember.role,
        team_members: members || []
      };
    },
  });

  const isAdmin = teamData?.role === 'admin';

  const addTeamMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      if (!teamData?.id) throw new Error('No team found');

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          user_id: email,
          role: 'member'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add team member",
        variant: "destructive",
      });
    },
  });

  const removeTeamMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!teamData?.id) throw new Error('No team found');

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamData.id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error removing team member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove team member",
        variant: "destructive",
      });
    },
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: 'admin' | 'member' }) => {
      if (!teamData?.id) throw new Error('No team found');

      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', teamData.id)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    },
  });

  return {
    teamData,
    isAdmin,
    isTeamLoading,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  };
};