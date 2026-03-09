
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventNotFoundState } from './EventNotFoundState';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/hooks/use-toast';

interface EventNotFoundHandlerProps {
  eventId?: string;
}

export const EventNotFoundHandler: React.FC<EventNotFoundHandlerProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Show a toast notification that the event wasn't found
    toast({
      title: "Event not found",
      description: `The event with code "${eventId}" doesn't exist or may have been deleted.`,
      variant: "destructive",
    });
  }, [toast, eventId]);

  const handleBack = () => {
    navigate('/events');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header 
        pageTitle="Event Not Found" 
        showBackButton
        onBackButtonClick={handleBack}
      />
      
      <div className="container py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <EventNotFoundState eventId={eventId} />
        </div>
      </div>
    </div>
  );
};
