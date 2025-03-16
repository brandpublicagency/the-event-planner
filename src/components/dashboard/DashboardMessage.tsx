
import React from 'react';
import { useDashboardMessage } from '@/hooks/useDashboardMessage';
import { useProfile } from '@/hooks/useProfile';
import { CalendarClock, Calendar, CheckSquare, Cloud, Sun, Quote } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

const DashboardMessage = () => {
  const { dashboardMessage, isLoading: messageLoading, error } = useDashboardMessage();
  const { profile, isLoading: profileLoading } = useProfile();
  
  const isLoading = messageLoading || profileLoading;
  
  if (isLoading) {
    return (
      <Card className="rounded-xl p-6 border bg-white w-full shadow-none">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>
      </Card>
    );
  }
  
  if (error || !dashboardMessage) {
    return (
      <Card className="rounded-xl p-6 border bg-white w-full shadow-none">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-gray-800">
            {profile?.full_name ? `Hi ${profile.full_name.split(' ')[0]},` : 'Hello there,'}
          </h2>
          <p className="text-gray-700">
            Welcome to your dashboard. Have a productive day!
          </p>
        </div>
      </Card>
    );
  }
  
  // Determine icon based on message type
  let Icon;
  let iconColor;
  
  switch (dashboardMessage.type) {
    case 'event':
      Icon = CalendarClock;
      iconColor = 'text-pink-500';
      break;
    case 'task':
      Icon = CheckSquare;
      iconColor = 'text-amber-500';
      break;
    case 'upcoming_event':
      Icon = Calendar;
      iconColor = 'text-blue-500';
      break;
    case 'weather':
      Icon = dashboardMessage.weatherData?.condition?.toLowerCase().includes('cloud') ? Cloud : Sun;
      iconColor = 'text-sky-500';
      break;
    default:
      Icon = Quote;
      iconColor = 'text-green-500';
  }
  
  // Format additional message details based on type
  let additionalDetails = null;
  
  if (dashboardMessage.type === 'event' && dashboardMessage.eventDetails) {
    const { start_time, pax, venues } = dashboardMessage.eventDetails;
    const venueText = venues && venues.length > 0 ? venues.join(', ') : 'Not specified';
    
    additionalDetails = (
      <div className="mt-2 text-sm text-gray-600">
        {start_time && <p>Start time: {start_time.substring(0, 5)}</p>}
        {pax && <p>Guests: {pax}</p>}
        <p>Venue: {venueText}</p>
      </div>
    );
  } else if (dashboardMessage.type === 'upcoming_event' && dashboardMessage.eventDetails) {
    const { event_date, name } = dashboardMessage.eventDetails;
    additionalDetails = (
      <div className="mt-2 text-sm text-gray-600">
        <p>Event: {name}</p>
        <p>Date: {format(new Date(event_date), 'EEEE, MMMM d, yyyy')}</p>
      </div>
    );
  } else if (dashboardMessage.type === 'task' && dashboardMessage.tasks && dashboardMessage.tasks.length > 0) {
    additionalDetails = (
      <div className="mt-2 text-sm text-gray-600">
        <p className="font-medium">Priority tasks:</p>
        <ul className="list-disc pl-5 mt-1">
          {dashboardMessage.tasks.slice(0, 3).map((task, index) => (
            <li key={index}>
              {task.title} {task.due_date ? `(Due: ${format(new Date(task.due_date), 'MMM d')})` : ''}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Weather info to display if available
  let weatherInfo = null;
  if (dashboardMessage.weatherData) {
    const { temp, condition, description } = dashboardMessage.weatherData;
    weatherInfo = (
      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-sm text-gray-600">
        <div className="flex items-center">
          {condition?.toLowerCase().includes('cloud') ? (
            <Cloud className="h-4 w-4 text-sky-500 mr-1" />
          ) : (
            <Sun className="h-4 w-4 text-amber-500 mr-1" />
          )}
          <span className="font-medium">Tomorrow:</span>
        </div>
        <span>{temp}°C, {description}</span>
      </div>
    );
  }
  
  // Get user's first name from profile
  const firstName = profile?.full_name ? profile.full_name.split(' ')[0] : '';
  
  return (
    <Card className="rounded-xl p-6 border bg-white w-full shadow-none">
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
          <h2 className="text-xl font-semibold text-gray-800">
            {`Hi ${firstName},`}
          </h2>
        </div>
        <p className="text-gray-700">{dashboardMessage.message}</p>
        {additionalDetails}
        {weatherInfo}
      </div>
    </Card>
  );
};

export default DashboardMessage;
