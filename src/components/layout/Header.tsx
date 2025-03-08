
import React from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";
import { NotificationButton } from "./NotificationButton";
import { BackButton } from "./BackButton";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { HeaderActions } from "./HeaderActions";

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

  // Determine if we need to show a subtitle for the dashboard
  const dashboardSubtitle = location.pathname === '/' && !subtitle 
    ? 'Your upcoming events and tasks' 
    : subtitle;

  const finalPageTitle = pageTitle || getDefaultPageTitle();
  
  const handleToggleMobileMenu = () => {
    document.documentElement.classList.toggle('sidebar-open');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="flex flex-col">
        {/* Top section with user controls */}
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex gap-4 items-center">
            <MobileMenuToggle onClick={handleToggleMobileMenu} />
            
            {showBackButton && (
              <BackButton path={backButtonPath} />
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <SearchBar />
            <NotificationButton />
            <UserMenu />
          </div>
        </div>
        
        {/* Page title and action button section */}
        <HeaderActions 
          pageTitle={finalPageTitle} 
          subtitle={dashboardSubtitle}
          actionButton={actionButton} 
        />
        
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
