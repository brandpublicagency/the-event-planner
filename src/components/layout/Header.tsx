
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Menu, 
  User, 
  Search, 
  Settings, 
  LogOut, 
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/events') return 'Events';
    if (path === '/passed-events') return 'Passed Events';
    if (path === '/calendar') return 'Calendar';
    if (path === '/tasks') return 'Tasks';
    if (path === '/contacts') return 'Contacts';
    if (path === '/documents') return 'Documents';
    if (path.includes('/profile')) return 'Profile';
    
    return 'Eventify';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex gap-6 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => document.documentElement.classList.toggle('sidebar-open')}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <h1 className="text-xl font-semibold text-zinc-900 hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 rounded-full bg-zinc-50 border-zinc-200 focus-visible:ring-0" 
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <Bell className="h-5 w-5 text-zinc-700" />
            <span className="sr-only">Notifications</span>
          </Button>

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
        </div>
      </div>
    </header>
  );
};
