
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Contact } from "@/types/contact";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface EventsBookedSectionProps {
  contact: Contact;
}

const EventsBookedSection = ({ contact }: EventsBookedSectionProps) => {
  // Get current date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine event status based on date and completion
  const getEventStatus = (event: any) => {
    if (!event.eventDate) return "Unknown";
    
    const eventDate = new Date(event.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    
    if (event.completed) return "Completed";
    if (eventDate < today) return "Passed";
    if (eventDate.getTime() === today.getTime()) return "Today";
    return "Upcoming";
  };
  
  // Get badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "secondary";
      case "Passed":
        return "outline";
      case "Today":
        return "default";
      case "Upcoming":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium uppercase tracking-wide mb-3">EVENTS BOOKED ({contact.events.length})</h3>
      <div className="flex flex-col gap-4">
        {contact.events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events booked</p>
        ) : (
          contact.events.map((event, index) => {
            const status = getEventStatus(event);
            return (
              <div key={event.eventCode} className={`flex flex-col gap-2 ${index !== 0 ? "pt-3 border-t border-border" : ""}`}>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/events/${event.eventCode}`}
                    className="text-gray-600 hover:text-gray-900 hover:underline text-sm py-1"
                  >
                    {event.eventName} {event.eventType}
                  </Link>
                  <Badge variant={getBadgeVariant(status)}>{status}</Badge>
                </div>
                
                {event.eventDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(event.eventDate), "dd MMM yyyy")}
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Venue: {event.venue}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsBookedSection;
