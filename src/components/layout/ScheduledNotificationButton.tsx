
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AlarmClock } from "lucide-react";

export function ScheduledNotificationButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-2 h-9 px-2"
      onClick={() => navigate('/notifications')}
    >
      <AlarmClock className="h-4 w-4" />
      <span className="text-sm">View All Notifications</span>
    </Button>
  );
}
