import { Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import TeamManagement from "./TeamManagement";
import { useTeamMembership } from "./company/useTeamMembership";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CompanyTeamSection = () => {
  const { data: teamMembership, isLoading, error, refetch: refetchTeamMembership } = useTeamMembership();

  const handleSuccess = async () => {
    await refetchTeamMembership();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Company & Team</h3>
      </div>
      
      {isLoading ? (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">Loading team information...</div>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>Error loading team information. Please try again.</AlertDescription>
        </Alert>
      ) : teamMembership ? (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Current Team</h4>
              <p className="text-lg">{teamMembership.team?.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Your Role</h4>
              <p className="capitalize">{teamMembership.role}</p>
            </div>
            {teamMembership.team?.company && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                <p>{teamMembership.team.company.name}</p>
              </div>
            )}
          </div>
        </Card>
      ) : null}

      <div className="mt-8">
        <TeamManagement />
      </div>
    </div>
  );
};

export default CompanyTeamSection;