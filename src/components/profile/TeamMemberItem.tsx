import { Button } from "@/components/ui/button";
import { Shield, User, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', member.user_id],
    queryFn: async () => {
      if (!member.user_id) {
        console.error('No user ID provided for profile query');
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', member.user_id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: !!member.user_id, // Only run query if we have a user_id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-300 rounded" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
      <div className="flex items-center gap-3">
        {member.role === 'admin' ? (
          <Shield className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
        <div>
          <p className="font-medium">{profile?.full_name || 'Unknown User'}</p>
          <p className="text-xs text-muted-foreground">Role: {member.role}</p>
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