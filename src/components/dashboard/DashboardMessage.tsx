import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { WeatherCard } from "./weather";

const DashboardMessage = () => {
  const {
    dashboardMessage,
    isLoading,
    error
  } = useDashboardMessage();
  const {
    profile,
    isLoading: isProfileLoading
  } = useProfile();

  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good day";
  if (hour < 12) greeting = "Good morning";else if (hour < 18) greeting = "Good afternoon";else greeting = "Good evening";

  const todayFormatted = format(now, "EEEE, MMMM d");
  const firstName = profile?.full_name?.split(' ')[0] || '';
  const personalizedGreeting = firstName ? `${greeting} ${firstName}` : greeting;

  let borderColorClass = "";
  let textColorClass = "";

  if (hour >= 20 && hour < 22) {
    borderColorClass = "border-slate-300";
    textColorClass = "text-indigo-300";
  }
  else if (hour >= 22 || hour < 2) {
    borderColorClass = "border-slate-400";
    textColorClass = "text-slate-300";
  }
  else if (hour >= 2 && hour < 4) {
    borderColorClass = "border-slate-400";
    textColorClass = "text-slate-300"; 
  }
  else if (hour >= 4 && hour < 6) {
    borderColorClass = "border-indigo-200";
    textColorClass = "text-indigo-300";
  }
  else if (hour >= 6 && hour < 8) {
    borderColorClass = "border-indigo-100";
    textColorClass = "text-indigo-400";
  } 
  else if (hour >= 8 && hour < 12) {
    borderColorClass = "border-sky-100";
    textColorClass = "text-sky-400";
  } 
  else if (hour >= 12 && hour < 16) {
    borderColorClass = "border-cyan-100";
    textColorClass = "text-cyan-400";
  } 
  else if (hour >= 16 && hour < 20) {
    borderColorClass = "border-amber-100";
    textColorClass = "text-amber-400";
  }

  if (isLoading || isProfileLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 col-span-4 shadow-sm rounded-xl">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </Card>
        <Card className="p-4 col-span-2 shadow-sm rounded-xl">
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>;
  }

  const weatherData = dashboardMessage.weatherData;
  const highTemp = weatherData?.temp || 27;
  const lowTemp = Math.max(highTemp - 18, 5);

  let chanceOfRain = "LOW";
  if (weatherData?.description) {
    const desc = weatherData.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      chanceOfRain = "HIGH";
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      chanceOfRain = "MEDIUM";
    }
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = format(tomorrow, "EEEE, d MMMM yyyy").toUpperCase();

  return <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card className={`p-4 col-span-4 shadow-sm border ${borderColorClass} h-full bg-transparent rounded-xl flex flex-col justify-between`}>
        <div className="flex flex-col justify-center">
          <h2 className="font-semibold text-gray-800 text-xl">{personalizedGreeting}</h2>
          
          {error ? <div className="flex items-start space-x-3 text-amber-600 mt-2">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p>Unable to load personalized updates. Check your connection and try again.</p>
            </div> : <p className="text-gray-600 mt-1 text-sm">{dashboardMessage.message}</p>}
        </div>
        
        <div className={`${textColorClass} text-xl font-medium tracking-wide mt-4`}>
          {todayFormatted.toUpperCase()}
        </div>
      </Card>
      
      {weatherData && <div className="col-span-2 h-full">
          <WeatherCard date={tomorrowFormatted} location="Warm Karoo, Bloemfontein" lowTemp={lowTemp} highTemp={highTemp} chanceOfRain={chanceOfRain} weatherData={weatherData} />
        </div>}
    </div>;
};

export default DashboardMessage;
