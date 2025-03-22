
import React from "react";
import { useLocation } from "react-router-dom";
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
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export interface HeaderProps {
  contextTitle?: string;
  pageTitle?: string;
  title?: string; // Added for backward compatibility
  actionButton?: ActionButtonProps;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonPath?: string;
  onBackButtonClick?: () => void;
}

export const Header = ({
  contextTitle,
  pageTitle,
  title, // Support the old title prop
  actionButton,
  secondaryAction,
  children,
  showBackButton,
  backButtonPath = "/",
  onBackButtonClick
}: HeaderProps = {}) => {
  const location = useLocation();

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
    return 'Event Management';
  };
  
  // Use title as fallback for pageTitle for backward compatibility
  const finalPageTitle = pageTitle || title || getDefaultPageTitle();
  
  const handleToggleMobileMenu = () => {
    document.documentElement.classList.toggle('sidebar-open');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-200">
      <div className="flex items-center h-16 px-6">
        <div className="flex gap-4 items-center">
          <MobileMenuToggle onClick={handleToggleMobileMenu} />
          
          {showBackButton && (
            <BackButton 
              path={backButtonPath} 
              onClick={onBackButtonClick} 
            />
          )}
          
          <SearchBar />
        </div>

        {children}

        <div className="ml-auto flex items-center gap-6">
          {secondaryAction}
          
          {actionButton && (
            <Button 
              variant={actionButton.variant || "default"} 
              size="sm" 
              onClick={actionButton.onClick} 
              disabled={actionButton.disabled} 
              className="gap-1"
            >
              {actionButton.icon}
              {actionButton.label}
            </Button>
          )}
          
          <NotificationButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
