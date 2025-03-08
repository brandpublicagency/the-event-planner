
import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";
import { NotificationButton } from "./NotificationButton";
import { BackButton } from "./BackButton";
import { PageTitle } from "./PageTitle";

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
  const location = useLocation();
  
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
              <BackButton path={backButtonPath} />
            ) : (
              finalContextTitle && (
                <span className="text-sm font-medium text-zinc-500">{finalContextTitle}</span>
              )
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <SearchBar />
            <NotificationButton />
            <UserMenu />
          </div>
        </div>
        
        {/* Page title section if provided */}
        {(finalPageTitle || actionButton) && (
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <PageTitle title={finalPageTitle} subtitle={dashboardSubtitle} />
            
            {actionButton && (
              <Button 
                onClick={actionButton.onClick}
                variant={actionButton.variant || "default"}
                className="self-start sm:self-center"
              >
                {actionButton.icon}
                <span className={cn(actionButton.icon ? "ml-2" : "")}>{actionButton.label}</span>
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
