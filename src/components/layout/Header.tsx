
import React from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { SearchBar } from "./SearchBar";
import { NotificationButton } from "./NotificationButton";
import { BackButton } from "./BackButton";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { Button } from "@/components/ui/button";
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
  actionButton?: ActionButtonProps;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonPath?: string;
}

export const Header = ({
  contextTitle,
  pageTitle,
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

  const finalPageTitle = pageTitle || getDefaultPageTitle();
  
  const handleToggleMobileMenu = () => {
    document.documentElement.classList.toggle('sidebar-open');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="flex items-center h-16 px-6">
        <div className="flex gap-4 items-center">
          <MobileMenuToggle onClick={handleToggleMobileMenu} />
          
          {showBackButton && (
            <BackButton path={backButtonPath} />
          )}
          
          {/* Page title now in the top bar */}
          {finalPageTitle && (
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900">{finalPageTitle}</h1>
          )}
        </div>

        {/* Children content */}
        {children}

        <div className="ml-auto flex items-center gap-4">
          <SearchBar />
          <NotificationButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
