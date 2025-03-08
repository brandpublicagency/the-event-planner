
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageTitle } from "./PageTitle";
import { ActionButtonProps } from "./Header";

interface HeaderActionsProps {
  pageTitle?: string;
  subtitle?: string;
  actionButton?: ActionButtonProps;
  contextTitle?: string;
}

export const HeaderActions = ({
  pageTitle,
  subtitle,
  actionButton,
  contextTitle
}: HeaderActionsProps) => {
  if (!pageTitle && !actionButton) return null;
  
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <PageTitle title={pageTitle} subtitle={subtitle} />
        {contextTitle && <span className="text-sm font-medium text-zinc-500 mt-1 block md:hidden">{contextTitle}</span>}
      </div>
      
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
  );
};
