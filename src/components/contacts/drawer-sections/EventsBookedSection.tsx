
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
  const getEventStatus = () => {
    if (!contact.eventDate) return "Unknown";
    
    const eventDate = new Date(contact.eventDate);
    eventDate.setHours(0, 0, 0, 0);
    
    if (contact.originalData?.completed) return "Completed";
    if (eventDate < today) return "Passed";
    if (eventDate.getTime() === today.getTime()) return "Today";
    return "Upcoming";
  };
  
  // Get badge color based on status
  const getBadgeVariant = () => {
    const status = getEventStatus();
    switch (status) {
      case "Completed":
        return "secondary";
      case "Passed":
        return "outline";
      case "Today":
        return "default";
      case "Upcoming":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium uppercase tracking-wide mb-3">EVENTS BOOKED</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link 
            to={`/events/${contact.eventCode}`}
            className="text-gray-600 hover:text-gray-900 hover:underline text-sm py-1"
          >
            {contact.company || contact.name} {contact.originalData?.event_type || 'Event'}
          </Link>
          <Badge variant={getBadgeVariant()}>{getEventStatus()}</Badge>
        </div>
        
        {contact.eventDate && (
          <div className="flex items-center text-xs text-gray-500">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {format(new Date(contact.eventDate), "dd MMM yyyy")}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsBookedSection;
