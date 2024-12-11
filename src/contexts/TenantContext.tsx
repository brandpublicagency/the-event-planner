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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No session found, redirecting to login');
        if (location.pathname !== '/login') {
          navigate('/login');
        }
        return [];
      }

      try {
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select(`
            id,
            name,
            team_members!inner (
              role
            )
          `)
          .eq('team_members.user_id', session.user.id);

        if (teamsError) throw teamsError;

        return (teams || []).map(team => ({
          id: team.id,
          name: team.name,
          role: team.team_members[0].role,
        }));
      } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
    },
    retry: false,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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