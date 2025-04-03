
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
          // Return basic information from auth even if profile fetch fails
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

  // Get user initials for avatar fallback
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
      "h-16 w-full flex items-center backdrop-blur-md bg-white/80 border-b border-gray-200/70 transition-all duration-200",
      isCollapsed ? "justify-center px-0" : "px-3"
    )}>
      <div className={cn(
        "flex items-center w-[258px]",
        isCollapsed ? "justify-center" : "gap-2"
      )}>
        <Avatar 
          className="h-8 w-8 cursor-pointer ring-2 ring-white/80 shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => navigate('/profile')}
        >
          <AvatarImage 
            src="https://www.warmkaroo.com/wp-content/uploads/2023/03/Warm-Karoo-Logo-Black.svg" 
            alt="Warm Karoo Logo" 
          />
          <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-xs font-medium">
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
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-2.5 w-16" />
              </>
            ) : (
              <>
                <div className="text-xs font-medium truncate text-gray-900">
                  {userInfo?.name || 'User'} {userInfo?.surname || ''}
                </div>
                <div className="text-[10px] text-gray-500 truncate">
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
