
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionButtonProps } from "./Header";

interface HeaderActionsProps {
  actionButton?: ActionButtonProps;
}

export const HeaderActions = ({
  actionButton
}: HeaderActionsProps) => {
  // This component is kept for backward compatibility
  // but all logic is now in the Header component
  console.log("HeaderActions is deprecated, use the actionButton prop in Header directly");
  return null;
};
