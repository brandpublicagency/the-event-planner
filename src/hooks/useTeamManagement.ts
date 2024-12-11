import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // First, get the user's team membership
  const { data: teamData } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's team membership and role in a single query
      const { data: userTeam, error: teamError } = await supabase
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

      return userTeam?.teams;
    },
  });

  // Determine if user is admin based on teamData
  const isAdmin = teamData?.team_members?.some(
    (member: any) => 
      member.user_id === (supabase.auth.getUser() as any)._data?.user?.id && 
      member.role === 'admin'
  ) ?? false;

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