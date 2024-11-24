import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProfileProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarProfile = ({ isCollapsed, setIsCollapsed }: SidebarProfileProps) => {
  const { data: userInfo } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        email: user.email,
        name: profile?.full_name || 'User',
        surname: profile?.surname || ''
      };
    },
  });

  return (
    <div className="px-4 py-4 flex items-center gap-3">
      <div className={cn(
        "w-10 h-10 rounded-full bg-[#0A0F1D] flex-shrink-0 cursor-pointer",
        isCollapsed ? "mx-auto" : ""
      )} />
      {!isCollapsed && (
        <div className="flex-1">
          <div className="text-sm font-medium">
            {userInfo?.name} {userInfo?.surname}
          </div>
          <div className="text-xs text-gray-400">{userInfo?.email}</div>
        </div>
      )}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          isCollapsed 
            ? "bg-[#0A0F1D] text-gray-400 hover:text-white hover:bg-[#2A2F3C]" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default SidebarProfile;