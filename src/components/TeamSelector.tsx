import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenant } from "@/contexts/TenantContext";

export function TeamSelector() {
  const { currentTeam, userTeams, setCurrentTeam } = useTenant();

  if (!currentTeam || userTeams.length <= 1) return null;

  return (
    <Select
      value={currentTeam.id}
      onValueChange={(value) => {
        const team = userTeams.find((t) => t.id === value);
        if (team) setCurrentTeam(team);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        {userTeams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}