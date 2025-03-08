
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonProps } from "./Header";

interface HeaderActionsProps {
  pageTitle?: string;
  subtitle?: string;
  actionButton?: ActionButtonProps;
}

export const HeaderActions = ({
  pageTitle,
  subtitle,
  actionButton
}: HeaderActionsProps) => {
  // Since we've moved the main functionality to Header.tsx, this component is simplified
  if (!actionButton) return null;
  
  return (
    <div className="px-6 py-2 flex justify-end">
      <Button 
        onClick={actionButton.onClick}
        variant={actionButton.variant || "default"}
      >
        {actionButton.icon}
        <span className={cn(actionButton.icon ? "ml-2" : "")}>{actionButton.label}</span>
      </Button>
    </div>
  );
};
