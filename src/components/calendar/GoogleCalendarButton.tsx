
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

  const connectToGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      console.log("Initiating Google Calendar connection");
      const { data, error } = await supabase.functions.invoke('calendar-auth');
      
      if (error) {
        console.error("Error connecting to Google Calendar:", error);
        throw error;
      }
      
      if (data?.url) {
        console.log("Redirecting to Google OAuth:", data.url);
        window.location.href = data.url; // Redirect to Google OAuth
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        variant: "destructive",
        title: "Calendar Connection Failed",
        description: "Could not connect to Google Calendar. Please try again later.",
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
        Connected to Google Calendar
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      className={`gap-2 ${className}`}
      onClick={connectToGoogleCalendar}
      disabled={isConnecting}
    >
      <CalendarIcon className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Google Calendar"}
    </Button>
  );
};
