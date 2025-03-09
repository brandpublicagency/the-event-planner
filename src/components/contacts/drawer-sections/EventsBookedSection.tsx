
import { Link } from "react-router-dom";
import { Contact } from "@/types/contact";

interface EventsBookedSectionProps {
  contact: Contact;
}

const EventsBookedSection = ({ contact }: EventsBookedSectionProps) => {
  return (
    <div className="pt-4 border-t">
      <h3 className="text-sm font-medium uppercase tracking-wide mb-3">EVENTS BOOKED</h3>
      <div className="flex flex-col gap-1">
        <Link 
          to={`/passed-events?event=${contact.eventCode}`}
          className="text-gray-600 hover:text-gray-900 hover:underline text-sm py-1"
        >
          {contact.company || contact.name} {contact.originalData?.event_type || 'Event'}
        </Link>
      </div>
    </div>
  );
};

export default EventsBookedSection;
