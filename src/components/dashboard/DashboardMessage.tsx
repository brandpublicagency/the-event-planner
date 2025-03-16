
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { CalendarClock, CheckSquare, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, AlertCircle } from "lucide-react";

const DashboardMessage = () => {
  const { dashboardMessage, isLoading, error } = useDashboardMessage();
  
  // Determine greeting based on time of day
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good day";
  
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";
  
  // Format today's date
  const todayFormatted = format(now, "EEEE, MMMM d");
  
  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-white shadow-sm">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </Card>
    );
  }

  // Choose appropriate icon based on message type
  let icon;
  switch (dashboardMessage.type) {
    case 'event':
      icon = <CalendarClock className="h-5 w-5 text-indigo-500" />;
      break;
    case 'task':
      icon = <CheckSquare className="h-5 w-5 text-amber-500" />;
      break;
    case 'upcoming_event':
      icon = <CalendarClock className="h-5 w-5 text-blue-500" />;
      break;
    case 'weather':
      icon = getWeatherIcon(dashboardMessage.weatherData?.condition);
      break;
    default:
      icon = <CalendarClock className="h-5 w-5 text-gray-500" />;
  }
  
  return (
    <Card className="p-6 mb-6 bg-white shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">{greeting}</h2>
          <span className="text-sm text-gray-500">{todayFormatted}</span>
        </div>
        
        {error ? (
          <div className="flex items-start space-x-3 text-amber-600">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <p>Unable to load personalized updates. Check your connection and try again.</p>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="mt-1">{icon}</div>
            <p className="text-gray-700">{dashboardMessage.message}</p>
          </div>
        )}
        
        {dashboardMessage.weatherData && dashboardMessage.type !== 'weather' && (
          <div className="flex items-center mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <div className="mr-2">
              {getWeatherIcon(dashboardMessage.weatherData.condition, "h-4 w-4")}
            </div>
            <span>Tomorrow: {dashboardMessage.weatherData.description}, {dashboardMessage.weatherData.temp}°C</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Helper function to get appropriate weather icon
const getWeatherIcon = (condition?: string, className = "h-5 w-5 text-sky-500") => {
  if (!condition) return <Cloud className={className} />;
  
  const lowercaseCondition = condition.toLowerCase();
  
  if (lowercaseCondition.includes('clear') || lowercaseCondition.includes('sun')) {
    return <Sun className={className} />;
  } else if (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle')) {
    return <CloudRain className={className} />;
  } else if (lowercaseCondition.includes('thunder') || lowercaseCondition.includes('storm')) {
    return <CloudLightning className={className} />;
  } else if (lowercaseCondition.includes('snow')) {
    return <CloudSnow className={className} />;
  } else if (lowercaseCondition.includes('mist') || lowercaseCondition.includes('fog')) {
    return <CloudFog className={className} />;
  } else if (lowercaseCondition.includes('cloud')) {
    return <Cloud className={className} />;
  } else {
    return <Cloud className={className} />;
  }
};

export default DashboardMessage;
