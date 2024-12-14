import { Button } from "@/components/ui/button";
import { Shield, User, Trash2 } from "lucide-react";
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

interface TeamMemberItemProps {
  member: {
    user_id: string;
    role: 'admin' | 'member';
  };
  isAdmin: boolean;
  onToggleRole: (userId: string, newRole: 'admin' | 'member') => void;
  onRemoveMember: (userId: string) => void;
  currentAdminId?: string;
}

const TeamMemberItem = ({ 
  member, 
  isAdmin, 
  onToggleRole, 
  onRemoveMember,
  currentAdminId 
}: TeamMemberItemProps) => {
  const canModify = isAdmin && member.user_id !== currentAdminId;

  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        {member.role === 'admin' ? (
          <Shield className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
        <div>
          <p className="font-medium">{member.user_id}</p>
          <p className="text-sm text-muted-foreground">Role: {member.role}</p>
        </div>
      </div>
      
      {canModify && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleRole(member.user_id, member.role === 'admin' ? 'member' : 'admin')}
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
                <AlertDialogAction onClick={() => onRemoveMember(member.user_id)}>
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default TeamMemberItem;