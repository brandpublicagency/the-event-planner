import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import CompanyDetails from "../../forms/CompanyDetails";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useTeamMembership } from "./useTeamMembership";
import { Card } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";

interface CreateCompanyFormProps {
  onSuccess: () => Promise<void>;
}

type CreateCompanyAndTeamResponse = Database["public"]["Functions"]["create_company_and_team"]["Returns"];
type CreateCompanyAndTeamArgs = Database["public"]["Functions"]["create_company_and_team"]["Args"];

export const CreateCompanyForm = ({ onSuccess }: CreateCompanyFormProps) => {
  const form = useForm();
  const { toast } = useToast();
  const { data: teamMembership } = useTeamMembership();

  const handleCreateTeam = async (data: any) => {
    if (!data.company_name) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }

    // Check if user already belongs to a team
    if (teamMembership) {
      toast({
        title: "Error",
        description: "You already belong to a team. You cannot create another one.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: result, error: rpcError } = await supabase.rpc(
        'create_company_and_team',
        {
          p_company_name: data.company_name,
          p_user_id: user.id
        }
      );

      if (rpcError) {
        toast({
          title: "Error",
          description: rpcError.message || "Failed to create team",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      await onSuccess();
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
    }
  };

  // If user already belongs to a team, show team information
  if (teamMembership?.team) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{teamMembership.team.company?.name}</h3>
              <p className="text-sm text-muted-foreground">Company</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">{teamMembership.team.name}</h3>
              <p className="text-sm text-muted-foreground">
                Your role: {teamMembership.role}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <CompanyDetails 
      form={form} 
      onSubmit={handleCreateTeam}
      showSubmit={true}
    />
  );
};