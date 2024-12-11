import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teamData } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // First get the user's team membership
      const { data: userTeamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single();

      if (teamMemberError) {
        console.error('Error fetching team member:', teamMemberError);
        return null;
      }

      if (!userTeamMember?.team_id) return null;

      // Then fetch the team details with members
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select(`
          *,
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

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: member, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return member?.role === 'admin';
    },
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !userProfile) {
        throw new Error('User not found');
      }

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData?.id,
          user_id: userProfile.id,
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeTeamMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: 'admin' | 'member' }) => {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    teamData,
    isAdmin,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  };
};