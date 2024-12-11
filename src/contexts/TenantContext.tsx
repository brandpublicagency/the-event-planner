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

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          role,
          teams (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      return data.map(({ teams, role }) => ({
        id: teams.id,
        name: teams.name,
        role,
      }));
    },
  });

  useEffect(() => {
    // Set the first team as current if none is selected and teams are loaded
    if (!currentTeam && userTeams.length > 0) {
      const savedTeamId = localStorage.getItem('currentTeamId');
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