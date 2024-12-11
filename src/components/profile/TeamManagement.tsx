import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TeamMembersList from "./TeamMembersList";
import AddTeamMember from "./AddTeamMember";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const TeamManagement = () => {
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm();
  const {
    teamData,
    isAdmin,
    isTeamLoading,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  } = useTeamManagement();

  const handleCreateTeam = async (data: { company_name: string }) => {
    if (!data.company_name) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          { name: data.company_name }
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // Then create team with company reference
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([
          { 
            name: `${data.company_name} Team`,
            company_id: companyData.id
          }
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add current user as admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error: memberError } = await supabase
        .from('team_members')
        .insert([
          { 
            team_id: teamData.id,
            user_id: user.id,
            role: 'admin'
          }
        ]);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = () => {
    if (!newTeamMemberEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    addTeamMemberMutation.mutate(newTeamMemberEmail, {
      onSuccess: () => {
        setNewTeamMemberEmail("");
        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to add team member",
          variant: "destructive",
        });
      },
    });
  };

  if (isTeamLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Loading team data...
        </div>
      </Card>
    );
  }

  if (!teamData) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="rounded-full bg-muted p-3">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">No Team Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You're not part of any team yet. Create a new team or ask your team admin to invite you.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleCreateTeam)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                  <Input
                    {...form.register("company_name")}
                    placeholder="Enter company name"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Team
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    );
  }

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
              onAdd={handleAddMember}
            />
          )}
        </div>

        <TeamMembersList
          members={teamData.team_members || []}
          isAdmin={isAdmin}
          currentAdminId={currentAdminId}
          onToggleRole={(userId, newRole) => toggleRoleMutation.mutate({ userId, newRole })}
          onRemoveMember={(userId) => removeTeamMemberMutation.mutate(userId)}
        />
      </div>
    </Card>
  );
};

export default TeamManagement;