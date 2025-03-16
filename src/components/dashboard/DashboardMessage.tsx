
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import WeatherCard from "./WeatherCard";

const DashboardMessage = () => {
  const { dashboardMessage, isLoading, error } = useDashboardMessage();
  const { profile, isLoading: isProfileLoading } = useProfile();
  
  // Determine greeting based on time of day
  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good day";
  
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";
  
  // Format today's date
  const todayFormatted = format(now, "EEEE, MMMM d");
  
  // Get the user's first name to display in the greeting
  const firstName = profile?.full_name?.split(' ')[0] || '';

  // Combine greeting with user's name if available
  const personalizedGreeting = firstName ? `${greeting} ${firstName}` : greeting;
  
  if (isLoading || isProfileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="p-6 col-span-4 bg-white shadow-sm">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </Card>
        <Card className="p-6 col-span-2 shadow-sm">
          <Skeleton className="h-28 w-full" />
        </Card>
      </div>
    );
  }

  // Calculate temperature range for weather card
  const weatherData = dashboardMessage.weatherData;
  const highTemp = weatherData?.temp || 27;
  const lowTemp = Math.max(highTemp - 18, 5); // Ensure low temp is at least 5 degrees
  
  // Determine chance of rain based on description
  let chanceOfRain = "LOW";
  if (weatherData?.description) {
    const desc = weatherData.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      chanceOfRain = "HIGH";
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      chanceOfRain = "MEDIUM";
    }
  }
  
  // Format tomorrow's date for the weather card
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = format(tomorrow, "EEEE, d MMMM yyyy").toUpperCase();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card className="p-6 col-span-4 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800">{personalizedGreeting}</h2>
        
        {error ? (
          <div className="flex items-start space-x-3 text-amber-600 mt-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <p>Unable to load personalized updates. Check your connection and try again.</p>
          </div>
        ) : (
          <p className="text-gray-600 mt-1">{dashboardMessage.message}</p>
        )}
        
        <div className="inline-block rounded-md bg-gray-100 px-4 py-1 mt-4 text-sm text-gray-700 uppercase tracking-wide font-medium">
          {todayFormatted.toUpperCase()}
        </div>
      </Card>
      
      {weatherData && (
        <div className="col-span-2">
          <WeatherCard 
            date={tomorrowFormatted}
            location="Warm Karoo, Bloemfontein"
            lowTemp={lowTemp}
            highTemp={highTemp}
            chanceOfRain={chanceOfRain}
            weatherData={weatherData}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardMessage;
