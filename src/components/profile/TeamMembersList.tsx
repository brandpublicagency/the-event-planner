import { Card } from "@/components/ui/card";
import TeamMemberItem from "./TeamMemberItem";

interface TeamMembersListProps {
  members: any[];
  isAdmin: boolean;
  currentAdminId: string;
  onToggleRole: (userId: string, newRole: 'admin' | 'member') => void;
  onRemoveMember: (userId: string) => void;
}

const TeamMembersList = ({
  members,
  isAdmin,
  currentAdminId,
  onToggleRole,
  onRemoveMember,
}: TeamMembersListProps) => {
  return (
    <div className="space-y-4">
      {members?.map((member) => (
        <TeamMemberItem
          key={member.id}
          member={{
            ...member,
            profiles: member.profiles
          }}
          isAdmin={isAdmin}
          currentAdminId={currentAdminId}
          onToggleRole={onToggleRole}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  );
};

export default TeamMembersList;