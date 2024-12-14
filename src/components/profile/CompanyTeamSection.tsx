import { Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import TeamManagement from "./TeamManagement";
import { useTeamMembership } from "./company/useTeamMembership";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CompanyTeamSection = () => {
  const { data: teamMembership, isLoading, error } = useTeamMembership();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Loading team information...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading team information. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Building className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Company & Team</h3>
      </div>

      <TeamManagement />
    </div>
  );
};

export default CompanyTeamSection;