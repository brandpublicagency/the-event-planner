import { useState } from "react";
import { Card } from "@/components/ui/card";
import TeamMembersList from "./TeamMembersList";
import AddTeamMember from "./AddTeamMember";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { useToast } from "@/components/ui/use-toast";

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

  console.log('TeamManagement component - teamData:', teamData);
  console.log('TeamManagement component - isAdmin:', isAdmin);

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
    console.log('No team data available');
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No team data available. Please create or join a team.
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