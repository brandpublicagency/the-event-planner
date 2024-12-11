import { Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import TeamManagement from "./TeamManagement";
import { CreateCompanyForm } from "./company/CreateCompanyForm";
import { useTeamMembership } from "./company/useTeamMembership";

const CompanyTeamSection = () => {
  const { data: teamMembership, refetch: refetchTeamMembership } = useTeamMembership();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Company & Team</h3>
      </div>
      
      <Card className="p-6">
        <CreateCompanyForm 
          onSuccess={refetchTeamMembership}
        />
      </Card>

      <div className="mt-8">
        <TeamManagement />
      </div>
    </div>
  );
};

export default CompanyTeamSection;