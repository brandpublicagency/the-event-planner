import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTeamMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addTeamMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const teamData = await queryClient.getQueryData(['team']) as any;
      if (!teamData?.id) {
        throw new Error('Team not found');
      }

      // First check if user already exists in auth
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      // Add member to team
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          email: email,
          role: 'member'
        });

      if (error) throw error;

      // If user doesn't exist, send invitation email through Supabase
      if (!existingUser) {
        const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
          data: {
            team_id: teamData.id,
          },
        });
        
        if (inviteError) throw inviteError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      toast({
        title: "Success",
        description: "Team member invited successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to invite team member",
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
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  };
};