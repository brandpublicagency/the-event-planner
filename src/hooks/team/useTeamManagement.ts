import { useTeamQuery } from "./useTeamQuery";
import { useTeamMutations } from "./useTeamMutations";
import { supabase } from "@/integrations/supabase/client";

export const useTeamManagement = () => {
  const { data: teamData } = useTeamQuery();
  const mutations = useTeamMutations();

  const isAdmin = teamData?.team_members?.some(
    (member: any) => 
      member.user_id === (supabase.auth.getUser() as any)._data?.user?.id && 
      member.role === 'admin'
  ) ?? false;

  return {
    teamData,
    isAdmin,
    ...mutations,
  };
};