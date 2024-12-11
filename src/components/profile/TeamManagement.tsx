import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import TeamMemberItem from "./TeamMemberItem";
import AddTeamMember from "./AddTeamMember";

type User = {
  id: string;
  email: string;
};

const TeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");

  const { data: teamData } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teams, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            id,
            user_id,
            role,
            profiles:user_id (
              full_name,
              email
            )
          )
        `)
        .single();

      if (error) {
        console.error('Error fetching team:', error);
        return null;
      }

      return teams;
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
      // First get the user profile by email
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
      setNewTeamMemberEmail("");
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

  if (!teamData) return null;

  const currentAdminId = teamData.team_members?.find((m: any) => m.role === 'admin')?.user_id;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Team Management</h3>
          {isAdmin && (
            <AddTeamMember
              email={newTeamMemberEmail}
              onEmailChange={setNewTeamMemberEmail}
              onAdd={() => addTeamMemberMutation.mutate(newTeamMemberEmail)}
            />
          )}
        </div>

        <div className="space-y-4">
          {teamData.team_members?.map((member: any) => (
            <TeamMemberItem
              key={member.id}
              member={member}
              isAdmin={isAdmin}
              currentAdminId={currentAdminId}
              onToggleRole={(userId, newRole) => toggleRoleMutation.mutate({ userId, newRole })}
              onRemoveMember={(userId) => removeTeamMemberMutation.mutate(userId)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TeamManagement;