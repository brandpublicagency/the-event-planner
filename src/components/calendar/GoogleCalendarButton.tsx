import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GoogleCalendarButtonProps {
  connected?: boolean;
  className?: string;
}

export const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({ 
  connected = false,
  className = "" 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectToCalCom = async () => {
    setIsConnecting(true);
    try {
      // Open Cal.com in a new window
      const calComURL = `https://app.cal.com/integrations/google-calendar/add`;
      window.open(calComURL, '_blank', 'noopener,noreferrer');
      
      toast({
        title: "Cal.com Calendar Connection",
        description: "Please complete the connection in the new browser tab. You may need to allow pop-ups.",
      });
      
      // Note: In a production app, you would implement a webhook callback from Cal.com
      // to confirm the connection was successful. For now, we'll keep the UI simple.
    } catch (error) {
      console.error('Error connecting to Cal.com:', error);
      toast({
        variant: "destructive",
        title: "Calendar Connection Failed",
        description: "Could not open Cal.com. Please try again later.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (connected) {
    return (
      <Button 
        variant="outline" 
        className={`gap-2 text-green-600 ${className}`}
        disabled
      >
        <Check className="h-4 w-4" />
        Connected to Cal.com
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      className={`gap-2 ${className}`}
      onClick={connectToCalCom}
      disabled={isConnecting}
    >
      <CalendarIcon className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect with Cal.com"}
    </Button>
  );
};
