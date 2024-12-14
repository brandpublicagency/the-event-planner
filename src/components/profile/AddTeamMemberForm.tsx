import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTeamMemberFormProps {
  onAddMember: (email: string) => Promise<void>;
}

const AddTeamMemberForm = ({ onAddMember }: AddTeamMemberFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddMember(email);
      setEmail("");
      toast({
        title: "Success",
        description: "Team member invitation sent successfully",
      });
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Add Team Member</h3>
          <p className="text-sm text-muted-foreground">
            Invite a new member to join your team
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Sending Invitation..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddTeamMemberForm;