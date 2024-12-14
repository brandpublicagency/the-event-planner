import TeamMemberItem from "./TeamMemberItem";

interface TeamMembersListProps {
  members: Array<{
    id: string;
    email: string;
    role: 'admin' | 'member';
  }>;
  isAdmin: boolean;
  currentAdminEmail: string;
  onToggleRole: (email: string, newRole: 'admin' | 'member') => void;
  onRemoveMember: (email: string) => void;
}

const TeamMembersList = ({
  members,
  isAdmin,
  currentAdminEmail,
  onToggleRole,
  onRemoveMember,
}: TeamMembersListProps) => {
  return (
    <div className="space-y-4">
      {members?.map((member) => (
        <TeamMemberItem
          key={member.id}
          member={member}
          isAdmin={isAdmin}
          currentAdminEmail={currentAdminEmail}
          onToggleRole={onToggleRole}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  );
};

export default TeamMembersList;