import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      // Mock event data
      return {
        name: "Sample Event",
        status: "Confirmed",
        event_date: new Date().toISOString(),
        event_venues: [{ venue: { name: "Sample Venue" } }],
        event_type: "Wedding",
        pax: 100,
        event_code: "EVENT-0001",
        bride_name: "Jane",
        bride_mobile: "1234567890",
        bride_email: "jane@example.com",
        groom_name: "John",
        groom_mobile: "0987654321",
        groom_email: "john@example.com",
        client_address: "123 Sample St"
      };
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const venueNames = event.event_venues?.map(ev => ev.venue.name).join(', ') || 'No venues selected';

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{event.name}</h2>
        <span className={`px-2 py-1 rounded-full text-sm ${
          event.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
          event.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{format(new Date(event.event_date), 'PPP')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Venues</p>
              <p>{venueNames}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p>{event.event_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guest Count</p>
              <p>{event.pax || 'TBC'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event Code</p>
              <p>{event.event_code || `EVENT-${format(new Date(event.event_date), 'ddMM')}`}</p>
            </div>
          </CardContent>
        </Card>

        {event.event_type === 'Wedding' && (
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <h3 className="font-semibold">Bride</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{event.bride_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                    <p>{event.bride_mobile}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{event.bride_email}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <h3 className="font-semibold">Groom</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{event.groom_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                    <p>{event.groom_mobile}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{event.groom_email}</p>
                  </div>
                </div>
              </div>

              {event.client_address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p>{event.client_address}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventDetails;