
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface BackButtonProps {
  path?: string;
  onClick?: () => void;
}

export const BackButton = ({ path = "/", onClick }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Check if we're on an edit page and get the event ID to return to the detail page
      const currentPath = location.pathname;
      if (currentPath.includes('/edit') && currentPath.includes('/events/')) {
        // Extract the event ID from the path
        const pathParts = currentPath.split('/');
        const eventIdIndex = pathParts.findIndex(part => part === 'events') + 1;
        
        if (eventIdIndex > 0 && eventIdIndex < pathParts.length) {
          const eventId = pathParts[eventIdIndex];
          navigate(`/events/${eventId}`);
        } else {
          navigate(path);
        }
      } else {
        navigate(path);
      }
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
