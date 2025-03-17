
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertCircle, Sun, Cloud, CloudRain } from "lucide-react";
import { WeatherCard } from "./weather";
import { motion } from "framer-motion";

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
  let glowClass = "";

  if (hour >= 20 && hour < 22) {
    borderColorClass = "border-slate-300/20";
    textColorClass = "text-indigo-300/80";
    glowClass = "";
  }
  else if (hour >= 22 || hour < 2) {
    borderColorClass = "border-slate-400/20";
    textColorClass = "text-slate-300/80";
    glowClass = "";
  }
  else if (hour >= 2 && hour < 4) {
    borderColorClass = "border-slate-400/20";
    textColorClass = "text-slate-300/80"; 
    glowClass = "";
  }
  else if (hour >= 4 && hour < 6) {
    borderColorClass = "border-indigo-200/20";
    textColorClass = "text-indigo-300/80";
    glowClass = "";
  }
  else if (hour >= 6 && hour < 8) {
    borderColorClass = "border-indigo-100/20";
    textColorClass = "text-indigo-400/80";
    glowClass = "";
  } 
  else if (hour >= 8 && hour < 12) {
    borderColorClass = "border-sky-100/20";
    textColorClass = "text-sky-400/80";
    glowClass = "";
  } 
  else if (hour >= 12 && hour < 16) {
    borderColorClass = "border-cyan-100/20";
    textColorClass = "text-cyan-400/80";
    glowClass = "";
  } 
  else if (hour >= 16 && hour < 20) {
    borderColorClass = "border-amber-100/20";
    textColorClass = "text-amber-400/80";
    glowClass = "";
  }

  // Get weather icon based on weather data
  const getWeatherIcon = () => {
    if (!dashboardMessage.weatherData?.description) return <Sun className="h-5 w-5" />;
    
    const desc = dashboardMessage.weatherData.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('shower') || desc.includes('drizzle')) {
      return <CloudRain className="h-5 w-5" />;
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className="h-5 w-5" />;
    }
    return <Sun className="h-5 w-5" />;
  };

  if (isLoading || isProfileLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 col-span-4 rounded-xl">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </Card>
        <Card className="p-4 col-span-2 rounded-xl">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-4"
      >
        <Card className={`p-5 h-full border ${borderColorClass} bg-gradient-to-br from-gray-50/40 to-gray-100/40 dark:from-gray-900/50 dark:to-gray-950/50 rounded-xl flex flex-col justify-between backdrop-blur-sm`}>
          <div className="flex flex-col justify-center">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 text-2xl flex items-center">
              {personalizedGreeting}
              <motion.span 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                className="ml-2"
              >
                {getWeatherIcon()}
              </motion.span>
            </h2>
            
            {error ? (
              <div className="flex items-start space-x-3 text-amber-600 mt-3 p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-lg">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <p>Unable to load personalized updates. Check your connection and try again.</p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-base leading-relaxed">
                {dashboardMessage.message}
              </p>
            )}
          </div>
          
          <div className={`${textColorClass} text-xl font-semibold tracking-wide mt-5`}>
            {todayFormatted.toUpperCase()}
          </div>
        </Card>
      </motion.div>
      
      {weatherData && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-2 h-full"
        >
          <WeatherCard 
            date={tomorrowFormatted} 
            location="Warm Karoo, Bloemfontein" 
            lowTemp={lowTemp} 
            highTemp={highTemp} 
            chanceOfRain={chanceOfRain} 
            weatherData={weatherData} 
          />
        </motion.div>
      )}
    </div>
  );
};

export default DashboardMessage;
