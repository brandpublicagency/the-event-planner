
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
  ChevronDown,
  ChevronLeft,
  Plus
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

export interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export interface HeaderProps {
  contextTitle?: string;
  pageTitle?: string;
  subtitle?: string;
  actionButton?: ActionButtonProps;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonPath?: string;
}

export const Header = ({
  contextTitle,
  pageTitle,
  subtitle,
  actionButton,
  secondaryAction,
  children,
  showBackButton,
  backButtonPath = "/"
}: HeaderProps = {}) => {
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

  // Get default page title based on current route if not provided
  const getDefaultPageTitle = () => {
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

  // Get default context title based on current route
  const getDefaultContextTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Event Management';
    if (path === '/events' || path.includes('/events/')) return 'Event Management';
    if (path === '/passed-events') return 'Event Management';
    if (path === '/calendar') return 'Event Management';
    if (path === '/tasks' || path.includes('/tasks/')) return 'Task Management';
    if (path === '/contacts') return 'Contact Management';
    if (path === '/documents') return 'Document Management';
    
    return undefined;
  };

  const finalPageTitle = pageTitle || getDefaultPageTitle();
  const finalContextTitle = contextTitle || getDefaultContextTitle();
  
  // Determine if we need to show a subtitle for the dashboard
  const dashboardSubtitle = location.pathname === '/' && !subtitle 
    ? 'Your upcoming events and tasks' 
    : subtitle;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="flex flex-col">
        {/* Top section with user controls */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => document.documentElement.classList.toggle('sidebar-open')}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            {showBackButton ? (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 mr-2"
                onClick={() => navigate(backButtonPath)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Back</span>
              </Button>
            ) : (
              finalContextTitle && (
                <span className="text-sm font-medium text-zinc-500">{finalContextTitle}</span>
              )
            )}
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
        
        {/* Page title section if provided */}
        {(finalPageTitle || actionButton) && (
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              {finalPageTitle && <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{finalPageTitle}</h1>}
              {dashboardSubtitle && <p className="text-sm mt-1 text-zinc-500">{dashboardSubtitle}</p>}
            </div>
            
            {actionButton && (
              <Button 
                onClick={actionButton.onClick}
                variant={actionButton.variant || "default"}
                className="self-start sm:self-center"
              >
                {actionButton.icon}
                <span className={actionButton.icon ? "ml-2" : ""}>{actionButton.label}</span>
              </Button>
            )}
          </div>
        )}
        
        {/* Additional content like tabs, filters, etc. */}
        {children && <div className="px-6 pb-3">{children}</div>}

        {/* Secondary action area */}
        {secondaryAction && (
          <div className="flex justify-end px-6 py-2 border-t border-zinc-100">
            {secondaryAction}
          </div>
        )}
      </div>
    </header>
  );
};
