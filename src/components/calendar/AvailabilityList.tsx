import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface AvailabilityListProps {
  availability: any[];
  getStatusColor: (status: string) => string;
}

const AvailabilityList = ({ availability, getStatusColor }: AvailabilityListProps) => {
  if (availability?.length === 0) {
    return <p className="text-muted-foreground">No bookings for this period</p>;
  }

  return (
    <div className="space-y-2">
      {availability?.map((slot) => (
        <div
          key={slot.id}
          className="rounded-md border p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-medium">{slot.venue?.name}</p>
                <Badge variant="secondary" className={getStatusColor(slot.status || '')}>
                  {slot.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(slot.start_time), 'PPP')}
              </p>
              <p className="text-sm">
                {format(new Date(slot.start_time), 'HH:mm')} - {format(new Date(slot.end_time), 'HH:mm')}
              </p>
              {slot.event && (
                <div className="mt-2">
                  <p className="text-sm font-medium">{slot.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {slot.event.event_type}
                    {slot.event.bride_name && slot.event.groom_name && (
                      <> • {slot.event.bride_name} & {slot.event.groom_name}</>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
          {slot.notes && (
            <p className="mt-2 text-sm text-muted-foreground">{slot.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AvailabilityList;