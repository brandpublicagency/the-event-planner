
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}

export function PageHeader({
  contextTitle,
  pageTitle,
  subtitle,
  actionButton,
  secondaryAction,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("page-container", className)}>
      {/* Context header */}
      <div className="context-header border-b border-zinc-200 py-4 px-6 flex items-center justify-between">
        <h1 className="context-title text-sm font-medium text-zinc-500">{contextTitle}</h1>
        {secondaryAction && (
          <div className="secondary-action">{secondaryAction}</div>
        )}
      </div>
      
      {/* Main header */}
      <div className="main-header px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title text-3xl font-bold tracking-tight">{pageTitle}</h2>
          {subtitle && <p className="page-subtitle text-sm mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
        
        {actionButton && (
          <Button 
            onClick={actionButton.onClick}
            className="self-start sm:self-center"
          >
            {actionButton.icon}
            <span className={actionButton.icon ? "ml-2" : ""}>{actionButton.label}</span>
          </Button>
        )}
      </div>
      
      {/* Page-specific content like tabs or search */}
      {children && <div className="px-6 pb-4">{children}</div>}
    </div>
  );
}
