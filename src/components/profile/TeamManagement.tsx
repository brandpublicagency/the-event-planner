import { Card } from "@/components/ui/card";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { Users } from "lucide-react";
import TeamMembersList from "./TeamMembersList";
import { CreateTeamDialog } from "./CreateTeamDialog";
import AddTeamMemberForm from "./AddTeamMemberForm";
import { EditTeamDialog } from "./EditTeamDialog";

const TeamManagement = () => {
  const {
    teamData,
    isAdmin,
    isTeamLoading,
    addTeamMemberMutation,
    removeTeamMemberMutation,
    toggleRoleMutation,
  } = useTeamManagement();

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
              You're not part of any team yet. Create a new team to get started.
            </p>
          </div>
          <CreateTeamDialog />
        </div>
      </Card>
    );
  }

  // Filter out members with null user_id before passing to TeamMembersList
  const validTeamMembers = teamData.team_members?.filter(member => member.user_id) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="p-6">
          <div className="space-y-6">
            {teamData.company && (
              <div className="pb-4 border-b">
                <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">{teamData.company.name}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Team</h4>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">{teamData.name}</p>
                  {isAdmin && (
                    <EditTeamDialog 
                      teamId={teamData.id} 
                      currentName={teamData.name} 
                    />
                  )}
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-4">Team Members</h4>
                <TeamMembersList
                  members={validTeamMembers}
                  isAdmin={isAdmin}
                  currentAdminId={validTeamMembers.find(m => m.role === 'admin')?.user_id}
                  onToggleRole={(userId, newRole) => toggleRoleMutation.mutate({ userId, newRole })}
                  onRemoveMember={(userId) => removeTeamMemberMutation.mutate(userId)}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {isAdmin && (
        <div className="md:col-span-1">
          <AddTeamMemberForm
            onAddMember={(email) => addTeamMemberMutation.mutateAsync(email)}
          />
        </div>
      )}
    </div>
  );
};

export default TeamManagement;