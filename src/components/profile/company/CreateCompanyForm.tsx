import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import CompanyDetails from "../../forms/CompanyDetails";
import { supabase } from "@/integrations/supabase/client";

interface CreateCompanyFormProps {
  onSuccess: () => Promise<void>;
}

type CreateCompanyAndTeamResponse = {
  company_id: string;
  team_id: string;
};

export const CreateCompanyForm = ({ onSuccess }: CreateCompanyFormProps) => {
  const form = useForm();
  const { toast } = useToast();

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

      const { data: result, error: rpcError } = await supabase.rpc<CreateCompanyAndTeamResponse>(
        'create_company_and_team',
        {
          p_company_name: data.company_name,
          p_user_id: user.id
        }
      );

      if (rpcError) throw rpcError;

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
      throw error;
    }
  };

  return (
    <CompanyDetails 
      form={form} 
      onSubmit={handleCreateTeam}
      showSubmit={true}
    />
  );
};