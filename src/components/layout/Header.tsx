
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { BackButton } from "./BackButton";
import { MobileMenuToggle } from "./MobileMenuToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import DashboardCommandPalette from "@/components/dashboard/DashboardCommandPalette";

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
  title?: string;
  actionButton?: ActionButtonProps;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backButtonPath?: string;
  onBackButtonClick?: () => void;
  hideSearchBar?: boolean;
}

export const Header = ({
  contextTitle,
  pageTitle,
  title,
  actionButton,
  secondaryAction,
  children,
  showBackButton,
  backButtonPath = "/",
  onBackButtonClick,
  hideSearchBar
}: HeaderProps = {}) => {
  const location = useLocation();
  const isDocumentsPage = location.pathname.startsWith('/documents');
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const getDefaultPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/events') return 'Events';
    if (path === '/events/passed') return 'Passed Events';
    if (path === '/calendar') return 'Calendar';
    if (path === '/tasks') return 'Tasks';
    if (path === '/contacts') return 'Contacts';
    if (path === '/documents') return 'Documents';
    if (path.includes('/profile')) return 'Profile';
    return 'Event Management';
  };
  
  const finalPageTitle = pageTitle || title || getDefaultPageTitle();
  
  const handleToggleMobileMenu = () => {
    document.documentElement.classList.toggle('sidebar-open');
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border h-[65px]">
        <div className="flex items-center h-full px-4">
          <div className="flex gap-4 items-center">
            <MobileMenuToggle onClick={handleToggleMobileMenu} />
            
            {showBackButton && (
              <BackButton 
                path={backButtonPath} 
                onClick={onBackButtonClick} 
              />
            )}


            {!isDocumentsPage && (
              <div className="relative w-[280px] sm:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 rounded-md border border-border bg-background pl-9 pr-12 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  onFocus={() => setCommandOpen(true)}
                  readOnly
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            )}
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
          </div>
        </div>
      </header>
      <DashboardCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </>
  );
};
