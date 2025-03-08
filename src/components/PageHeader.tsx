
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export interface PageHeaderProps {
  contextTitle: string;
  pageTitle: string;
  subtitle?: string;
  actionButton?: ActionButtonProps;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  showBackButton?: boolean;
  backButtonPath?: string;
}

export function PageHeader({
  contextTitle,
  pageTitle,
  subtitle,
  actionButton,
  secondaryAction,
  children,
  className,
  showBackButton,
  backButtonPath = "/",
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("page-header sticky top-0 z-10 bg-white", className)}>
      {/* Context header */}
      <div className="context-header border-b border-zinc-200 py-3 px-6 flex items-center justify-between bg-zinc-50/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full p-0 w-8 h-8 mr-1"
              onClick={() => navigate(backButtonPath)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <h1 className="context-title text-sm font-medium text-zinc-500">{contextTitle}</h1>
        </div>
        {secondaryAction && (
          <div className="secondary-action">{secondaryAction}</div>
        )}
      </div>
      
      {/* Main header */}
      <div className="main-header px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shadow-sm">
        <div>
          <h2 className="page-title text-2xl font-bold tracking-tight text-zinc-900">{pageTitle}</h2>
          {subtitle && <p className="page-subtitle text-sm mt-1 text-zinc-500">{subtitle}</p>}
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
      
      {/* Page-specific content like tabs or search */}
      {children && <div className="px-6 pb-4 border-b border-zinc-100">{children}</div>}
    </div>
  );
}
