
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  path?: string;
}

export const BackButton = ({ path = "/" }: BackButtonProps) => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full h-8 mr-2"
      onClick={() => navigate(path)}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">Back</span>
    </Button>
  );
};
