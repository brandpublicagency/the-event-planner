
import { Card } from "@/components/ui/card";
import PublicEventForm from "@/components/public/PublicEventForm";

export default function PublicEventFormPage() {
  return (
    <div className="min-h-screen bg-zinc-50 py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <Card className="p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Event Booking Request</h1>
            <p className="text-muted-foreground">Please fill in the form below to request your event booking with Warm Karoo.</p>
          </div>
          <PublicEventForm />
        </Card>
      </div>
    </div>
  );
}
