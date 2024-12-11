import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface AddTeamMemberProps {
  email: string;
  onEmailChange: (email: string) => void;
  onAdd: () => void;
}

const AddTeamMember = ({ email, onEmailChange, onAdd }: AddTeamMemberProps) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter email address"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-64"
      />
      <Button onClick={onAdd}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};

export default AddTeamMember;