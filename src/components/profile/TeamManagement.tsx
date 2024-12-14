import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import AddTeamMember from "./AddTeamMember";
import TeamMembersList from "./TeamMembersList";
import { CreateTeamDialog } from "./CreateTeamDialog";

const TeamManagement = () => {
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
  const { toast } = useToast();
  const {
    teamData,
    isAdmin,
    isTeamLoading,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  } = useTeamManagement();

  const handleAddMember = async () => {
    if (!newTeamMemberEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTeamMemberMutation.mutateAsync(newTeamMemberEmail);
      setNewTeamMemberEmail("");
    } catch (error: any) {
      console.error('Error adding team member:', error);
    }
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
          <CreateTeamDialog />
        </div>
      </Card>
    );
  }

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
          currentAdminEmail={teamData.team_members?.find(m => m.role === 'admin')?.email}
          onToggleRole={(email, newRole) => toggleRoleMutation.mutate({ email, newRole })}
          onRemoveMember={(email) => removeTeamMemberMutation.mutate(email)}
        />
      </div>
    </Card>
  );
};

export default TeamManagement;