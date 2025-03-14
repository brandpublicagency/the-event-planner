
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  path?: string;
  onClick?: () => void;
}

export const BackButton = ({ path = "/", onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(path);
    }
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full h-8 mr-2"
      onClick={handleClick}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">Back</span>
    </Button>
  );
};
