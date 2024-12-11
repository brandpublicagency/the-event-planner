import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CreateTeamDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm();

  const handleCreateTeam = async (formData: { company_name: string }) => {
    if (!formData.company_name) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Create company and get the response
      const companyResponse = await supabase
        .from('companies')
        .insert([{ name: formData.company_name }])
        .select()
        .single();

      if (companyResponse.error) throw companyResponse.error;
      const company = companyResponse.data;

      // Create team with company reference
      const teamResponse = await supabase
        .from('teams')
        .insert([{ 
          name: `${formData.company_name} Team`,
          company_id: company.id
        }])
        .select()
        .single();

      if (teamResponse.error) throw teamResponse.error;
      const team = teamResponse.data;

      // Add current user as admin
      const memberResponse = await supabase
        .from('team_members')
        .insert([{ 
          team_id: team.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (memberResponse.error) throw memberResponse.error;

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      setIsOpen(false);
      // Reload the page to show the new team
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
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
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleCreateTeam)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Company Name</label>
            <Input
              {...form.register("company_name")}
              placeholder="Enter company name"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};