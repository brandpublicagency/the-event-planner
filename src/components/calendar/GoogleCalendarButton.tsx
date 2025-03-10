
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GoogleCalendarButtonProps {
  connected?: boolean;
}

export const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({ connected = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectToGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('calendar-auth');
      
      if (error) {
        throw error;
      }
      
      if (data?.url) {
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
        className="gap-2 ml-auto text-green-600" 
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
      className="gap-2 ml-auto" 
      onClick={connectToGoogleCalendar}
      disabled={isConnecting}
    >
      <CalendarIcon className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect to Google Calendar"}
    </Button>
  );
};
