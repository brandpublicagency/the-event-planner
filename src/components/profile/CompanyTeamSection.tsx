import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Building, Users } from "lucide-react";
import CompanyDetails from "../forms/CompanyDetails";
import TeamManagement from "./TeamManagement";
import { supabase } from "@/integrations/supabase/client";

const CompanyTeamSection = () => {
  const form = useForm();
  const { toast } = useToast();
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

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
      // First create the company
      const companyResponse = await supabase
        .from('companies')
        .insert([
          { name: data.company_name }
        ])
        .select()
        .single();

      if (companyResponse.error) throw companyResponse.error;
      const company = companyResponse.data;

      // Then create team with company reference
      const teamResponse = await supabase
        .from('teams')
        .insert([
          { 
            name: `${data.company_name} Team`,
            company_id: company.id
          }
        ])
        .select()
        .single();

      if (teamResponse.error) throw teamResponse.error;
      const team = teamResponse.data;

      // Add current user as admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const memberResponse = await supabase
        .from('team_members')
        .insert([
          { 
            team_id: team.id,
            user_id: user.id,
            role: 'admin'
          }
        ]);

      if (memberResponse.error) throw memberResponse.error;

      toast({
        title: "Success",
        description: "Company and team created successfully",
      });
      
      setIsCreatingTeam(false);
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create team",
        variant: "destructive",
      });
      throw error; // Re-throw to be handled by the form
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
          showSubmit={!isCreatingTeam}
        />
      </Card>

      <div className="mt-8">
        <TeamManagement />
      </div>
    </div>
  );
};

export default CompanyTeamSection;