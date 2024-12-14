import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditTeamDialogProps {
  teamId: string;
  currentName: string;
}

export const EditTeamDialog = ({ teamId, currentName }: EditTeamDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      team_name: currentName
    }
  });
  const queryClient = useQueryClient();

  const handleEditTeam = async (formData: { team_name: string }) => {
    if (!formData.team_name) {
      toast({
        title: "Error",
        description: "Please enter a team name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error: teamError } = await supabase
        .from('teams')
        .update({ name: formData.team_name })
        .eq('id', teamId);

      if (teamError) throw teamError;

      toast({
        title: "Success",
        description: "Team updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Error updating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update team",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update your team's name. This will be visible to all team members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleEditTeam)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Team Name</label>
            <Input
              {...form.register("team_name")}
              placeholder="Enter team name"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Team"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};