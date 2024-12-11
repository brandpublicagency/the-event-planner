import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Team {
  id: string;
  name: string;
  role: 'admin' | 'member';
}

interface TenantContextType {
  currentTeam: Team | null;
  userTeams: Team[];
  isLoading: boolean;
  error: Error | null;
  setCurrentTeam: (team: Team) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  const { data: userTeams = [], isLoading, error } = useQuery({
    queryKey: ['user-teams'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // First, get the teams the user is a member of
      const { data: teamMemberships, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          team_members!inner (
            role
          )
        `)
        .eq('team_members.user_id', user.id);

      if (teamsError) throw teamsError;

      return teamMemberships.map(team => ({
        id: team.id,
        name: team.name,
        role: team.team_members[0].role,
      }));
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  useEffect(() => {
    const savedTeamId = localStorage.getItem('currentTeamId');
    
    // Only set current team if we have teams and no current team
    if (userTeams.length > 0 && !currentTeam) {
      const savedTeam = savedTeamId 
        ? userTeams.find(team => team.id === savedTeamId)
        : userTeams[0];
      
      if (savedTeam) {
        setCurrentTeam(savedTeam);
      }
    }
  }, [userTeams, currentTeam]);

  const handleSetCurrentTeam = (team: Team) => {
    setCurrentTeam(team);
    localStorage.setItem('currentTeamId', team.id);
    toast({
      title: "Team Changed",
      description: `Switched to ${team.name}`,
    });
  };

  return (
    <TenantContext.Provider
      value={{
        currentTeam,
        userTeams,
        isLoading,
        error: error as Error | null,
        setCurrentTeam: handleSetCurrentTeam,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}