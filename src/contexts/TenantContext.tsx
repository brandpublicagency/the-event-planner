import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userTeams = [], isLoading, error } = useQuery({
    queryKey: ['user-teams'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (location.pathname !== '/login') {
          navigate('/login');
        }
        return [];
      }

      // Fetch team memberships with team details in a single query
      const { data, error: teamsError } = await supabase
        .from('team_members')
        .select(`
          role,
          team:teams (
            id,
            name
          )
        `)
        .eq('user_id', session.user.id);

      if (teamsError) {
        console.error('Error fetching teams:', teamsError);
        throw teamsError;
      }

      // Transform the data into the expected format
      return data
        .filter(membership => membership.team) // Filter out any null teams
        .map(membership => ({
          id: membership.team.id,
          name: membership.team.name,
          role: membership.role
        }));
    },
    retry: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setCurrentTeam(null);
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    const savedTeamId = localStorage.getItem('currentTeamId');
    
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