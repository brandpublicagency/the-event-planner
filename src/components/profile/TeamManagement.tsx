import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus, Trash2, Shield, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TeamManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");

  const { data: teamData } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data: teams } = await supabase
        .from('teams')
        .select('*, team_members(*, profiles(*))')
        .single();
      return teams;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: member } = await supabase
        .from('team_members')
        .select('role')
        .eq('user_id', user.id)
        .single();

      return member?.role === 'admin';
    },
  });

  const addTeamMemberMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData?.id,
          user_id: user.id,
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-semibold">Team Management</h3>
          {isAdmin && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                value={newTeamMemberEmail}
                onChange={(e) => setNewTeamMemberEmail(e.target.value)}
                className="w-64"
              />
              <Button onClick={() => addTeamMemberMutation.mutate(newTeamMemberEmail)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {teamData.team_members?.map((member: any) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {member.role === 'admin' ? (
                  <Shield className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{member.profiles?.full_name || 'Unnamed User'}</p>
                  <p className="text-sm text-muted-foreground">Role: {member.role}</p>
                </div>
              </div>
              
              {isAdmin && member.user_id !== (teamData.team_members.find((m: any) => m.role === 'admin')?.user_id) && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRoleMutation.mutate({
                      userId: member.user_id,
                      newRole: member.role === 'admin' ? 'member' : 'admin'
                    })}
                  >
                    {member.role === 'admin' ? 'Make Member' : 'Make Admin'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this team member? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeTeamMemberMutation.mutate(member.user_id)}
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TeamManagement;