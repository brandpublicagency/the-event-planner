
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const UserMenu = () => {
  const navigate = useNavigate();
  
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['header-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email,
        fullName: profile?.full_name || 'User',
        surname: profile?.surname || '',
        initials: profile?.full_name 
          ? `${profile.full_name.charAt(0)}${profile.surname ? profile.surname.charAt(0) : ''}`
          : 'U'
      };
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full p-0 h-10 w-10 border border-zinc-200">
          {isLoadingProfile ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={userProfile?.fullName || 'User'} />
              <AvatarFallback className="bg-zinc-100 text-zinc-800">
                {userProfile?.initials || 'U'}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 mt-1 p-2">
        <div className="flex flex-col px-2 pt-1 pb-2">
          <span className="text-sm font-medium">
            {isLoadingProfile ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              `${userProfile?.fullName || ''} ${userProfile?.surname || ''}`
            )}
          </span>
          <span className="text-xs text-muted-foreground">
            {isLoadingProfile ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : (
              userProfile?.email || ''
            )}
          </span>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
