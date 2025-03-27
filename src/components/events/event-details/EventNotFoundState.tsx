
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';

interface EventNotFoundStateProps {
  eventId?: string;
}

export const EventNotFoundState: React.FC<EventNotFoundStateProps> = ({ eventId }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-yellow-200 bg-yellow-50/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-yellow-100 p-2 rounded-full">
            <Calendar className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">Event Not Found</h2>
            <p className="text-yellow-600 mb-4">
              {eventId 
                ? `The event "${eventId}" couldn't be found or may have been deleted.` 
                : "The event you're looking for doesn't exist or has been deleted."}
            </p>
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/events')} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
              <Button onClick={() => navigate('/events/new')} variant="secondary">
                Create New Event
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
