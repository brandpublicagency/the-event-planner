import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/types/event";

interface EventInfoProps {
  event: Event;
  formattedDate: string;
  formattedTime: string;
  venueNames: string;
}

export const EventInfo = ({ event, formattedDate, formattedTime, venueNames }: EventInfoProps) => {
  const { toast } = useToast();

  const handleCopyEventCode = async () => {
    if (event.event_code) {
      await navigator.clipboard.writeText(event.event_code);
      toast({
        description: "Event code copied to clipboard",
      });
    }
  };

  return (
    <div className="print:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight print:text-xl">{event.name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            {event.event_code}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="print:hidden p-0 h-6 w-6"
            onClick={handleCopyEventCode}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-zinc-600 print:text-sm">
        <Badge variant="secondary">{formattedDate}</Badge>
        {formattedTime && <Badge variant="secondary">{formattedTime}</Badge>}
        <Badge variant="secondary">{event.event_type}</Badge>
        <Badge variant="secondary">{event.pax || 'No'} Guests</Badge>
        <Badge variant="secondary">{venueNames}</Badge>
      </div>
    </div>
  );
};