
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  const navigate = useNavigate();
  
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return null;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          return {
            email: user.email,
            name: 'User',
            surname: ''
          };
        }

        return {
          email: user.email,
          name: profile?.full_name || 'User',
          surname: profile?.surname || ''
        };
      } catch (error) {
        return {
          email: 'user@example.com',
          name: 'User',
          surname: ''
        };
      }
    },
  });

  const getUserInitials = () => {
    if (!userInfo) return "WK";
    
    const firstInitial = userInfo.name?.charAt(0) || '';
    const lastInitial = userInfo.surname?.charAt(0) || '';
    
    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    } else if (firstInitial) {
      return firstInitial;
    }
    
    return "WK";
  };

  return (
    <div className={cn(
      "h-[65px] w-full flex items-center border-b border-border bg-white/30 transition-all duration-200",
      isCollapsed ? "justify-center px-0" : "px-3"
    )}>
      <div className={cn(
        "flex items-center w-[260px]",
        isCollapsed ? "justify-center" : "gap-2"
      )}>
        <Avatar 
          className="h-8 w-8 cursor-pointer ring-2 ring-white/60 shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/profile')}
        >
          <AvatarImage 
            src="https://www.warmkaroo.com/wp-content/uploads/2023/03/Warm-Karoo-Logo-Black.svg" 
            alt="Warm Karoo Logo" 
          />
          <AvatarFallback className="bg-white/30 text-foreground text-xs font-medium">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>

        {!isCollapsed && (
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <>
                <Skeleton className="h-3 w-20 mb-1 bg-white/20" />
                <Skeleton className="h-2.5 w-16 bg-white/15" />
              </>
            ) : (
              <>
                <div className="text-xs font-medium truncate text-foreground">
                  {userInfo?.name || 'User'} {userInfo?.surname || ''}
                </div>
                <div className="text-[10px] text-foreground/50 truncate">
                  {userInfo?.email || 'user@example.com'}
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
