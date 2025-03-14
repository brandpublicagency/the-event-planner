
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  const { data: userInfo, isLoading } = useQuery({
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
        name: profile?.full_name || '',
        surname: profile?.surname || ''
      };
    },
  });

  return (
    <div className={cn(
      "h-[65px] w-[calc(100%+1px)] flex items-center backdrop-blur-sm bg-white/80 border-b border-zinc-200",
      isCollapsed ? "justify-center px-0" : "px-4 gap-3"
    )}>
      <a 
        href="https://www.warmkaroo.com" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Avatar className={cn(
          "w-10 h-10 flex-shrink-0 cursor-pointer"
        )}>
          <AvatarImage src="https://www.warmkaroo.com/wp-content/uploads/2023/03/Warm-Karoo-Logo-Black.svg" alt="Warm Karoo Logo" />
          <AvatarFallback className="bg-[#0A0F1D]">WK</AvatarFallback>
        </Avatar>
      </a>
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </>
          ) : (
            <>
              <div className="text-sm font-medium truncate">
                {userInfo?.name} {userInfo?.surname}
              </div>
              <div className="text-xs text-gray-400 truncate">{userInfo?.email || ''}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SidebarProfile;
