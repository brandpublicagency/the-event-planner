
import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import WeatherWidget from "./weather/WeatherWidget";

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
  const { refreshNotifications } = useNotifications();

  // Refresh notifications when the dashboard loads
  useEffect(() => {
    refreshNotifications().catch(err => {
      console.error('Error refreshing notifications from dashboard:', err);
    });
  }, [refreshNotifications]);

  useEffect(() => {
    if (dashboardMessage) {
      console.log("Dashboard message received:", dashboardMessage);
      console.log("Weather data available:", !!dashboardMessage.weatherData);
      if (dashboardMessage.weatherData) {
        console.log("Weather data details:", dashboardMessage.weatherData);
      }
    }
  }, [dashboardMessage]);

  const hour = new Date().getHours();
  let greeting = "Good day";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const personalizedGreeting = firstName ? `${greeting} ${firstName}` : greeting;

  if (isLoading || isProfileLoading) {
    return <div className="mb-6 mt-4">
        <div className="p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
      </div>;
  }

  return (
    <div className="mb-6 mt-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-2xl">
            {personalizedGreeting}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-base leading-relaxed">
            {dashboardMessage.message}
          </p>
        </div>
      </motion.div>
      
      {/* Ensure the weather widget always displays by adding a fallback condition */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4"
      >
        <WeatherWidget forcedVisible={true} />
      </motion.div>
    </div>
  );
};

export default DashboardMessage;
