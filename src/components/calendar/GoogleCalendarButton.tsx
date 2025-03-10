
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Check, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GoogleCalendarButtonProps {
  connected?: boolean;
  className?: string;
  onSync?: () => void;
}

export const GoogleCalendarButton: React.FC<GoogleCalendarButtonProps> = ({ 
  connected = false,
  className = "",
  onSync
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

      // Simulate successful connection after 5 seconds
      // In a production app, this would be replaced with a webhook callback
      setTimeout(() => {
        // Update URL with success parameter to trigger the effect in the Calendar component
        const url = new URL(window.location.href);
        url.searchParams.set('cal_success', 'true');
        window.history.pushState({}, '', url);
        
        // Dispatch an event to notify the Calendar component
        window.dispatchEvent(new Event('popstate'));
        
        setIsConnecting(false);
      }, 5000);
    } catch (error) {
      console.error('Error connecting to Cal.com:', error);
      toast({
        variant: "destructive",
        title: "Calendar Connection Failed",
        description: "Could not open Cal.com. Please try again later.",
      });
      setIsConnecting(false);
    }
  };

  const handleSyncAllEvents = async () => {
    if (!connected) {
      toast({
        variant: "destructive",
        title: "Calendar Not Connected",
        description: "Please connect to Cal.com first.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-all-events');
      
      if (error) throw error;
      
      toast({
        title: "Events Synced",
        description: "All events have been synced with Cal.com/Google Calendar."
      });
      
      if (onSync) onSync();
    } catch (error) {
      console.error('Error syncing events:', error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Failed to sync events with calendar. Please try again later."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (connected) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className={`gap-2 text-green-600 ${className}`}
          disabled
        >
          <Check className="h-4 w-4" />
          Connected to Cal.com
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleSyncAllEvents}
          disabled={isConnecting}
        >
          <RefreshCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
          {isConnecting ? "Syncing..." : "Sync All Events"}
        </Button>
      </div>
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
