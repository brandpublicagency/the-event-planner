import { useState } from "react";
import { Card } from "@/components/ui/card";
import TeamMembersList from "./TeamMembersList";
import AddTeamMember from "./AddTeamMember";
import { useTeamManagement } from "@/hooks/useTeamManagement";

const TeamManagement = () => {
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
  const {
    teamData,
    isAdmin,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  } = useTeamManagement();

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
              onAdd={() => {
                addTeamMemberMutation.mutate(newTeamMemberEmail);
                setNewTeamMemberEmail("");
              }}
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