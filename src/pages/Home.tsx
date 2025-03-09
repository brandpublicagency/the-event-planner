
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
          Event Management Portal
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your event management system. Manage all your events, documents, and client information in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate("/events")} size="lg">
            View Events
          </Button>
          <Button onClick={() => navigate("/events/new")} size="lg" variant="outline">
            Create New Event
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
