import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const CreateTeamDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleCreateTeam = async (formData: { company_name: string }) => {
    if (!formData.company_name) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to create a team",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ 
          name: formData.company_name,
        }])
        .select()
        .single();

      if (companyError) {
        console.error('Company creation error:', companyError);
        throw new Error(companyError.message);
      }

      if (!company) throw new Error("Failed to create company");

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{ 
          name: `${formData.company_name} Team`,
          company_id: company.id
        }])
        .select()
        .single();

      if (teamError) throw teamError;
      if (!team) throw new Error("Failed to create team");

      // Add current user as admin
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{ 
          team_id: team.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['team'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      setIsOpen(false);
      form.reset();
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new company and team. You'll be automatically added as an admin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateTeam)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
            <Input
              {...form.register("company_name")}
              placeholder="Enter company name"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Team"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};