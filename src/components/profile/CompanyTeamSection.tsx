import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Building } from "lucide-react";
import CompanyDetails from "../forms/CompanyDetails";
import TeamManagement from "./TeamManagement";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DatabaseFunctions } from "@/integrations/supabase/types/functions";

type CreateCompanyAndTeamFunction = DatabaseFunctions['create_company_and_team'];
type CreateCompanyAndTeamArgs = CreateCompanyAndTeamFunction['Args'];
type CreateCompanyAndTeamReturns = CreateCompanyAndTeamFunction['Returns'];

const CompanyTeamSection = () => {
  const form = useForm();
  const { toast } = useToast();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  // First fetch the user's team membership
  const { data: teamMembership, refetch: refetchTeamMembership } = useQuery({
    queryKey: ['team-membership'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          role,
          team:teams (
            id,
            name,
            company:companies (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching team membership:', error);
        return null;
      }

      return data;
    },
  });

  const handleCreateTeam = async (data: any) => {
    if (!data.company_name) {
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

      // Start a transaction using RPC
      const { data: result, error: rpcError } = await supabase.rpc<
        CreateCompanyAndTeamReturns,
        CreateCompanyAndTeamArgs
      >('create_company_and_team', {
        p_company_name: data.company_name,
        p_user_id: user.id
      });

      if (rpcError) throw rpcError;

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      // Refetch team membership to update the UI
      await refetchTeamMembership();
      setIsCreatingTeam(false);
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Company & Team</h3>
      </div>
      
      <Card className="p-6">
        <CompanyDetails 
          form={form} 
          onSubmit={handleCreateTeam}
          showSubmit={!teamMembership}
        />
      </Card>

      <div className="mt-8">
        <TeamManagement />
      </div>
    </div>
  );
};

export default CompanyTeamSection;