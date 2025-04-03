import { useDashboardMessage } from "@/hooks/useDashboardMessage";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import WeatherWidget from "./weather/WeatherWidget";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Refresh notifications when the dashboard loads
  useEffect(() => {
    refreshNotifications().catch(err => {
      console.error('Error refreshing notifications from dashboard:', err);
    });
  }, [refreshNotifications]);

  // Log dashboard message for debugging
  useEffect(() => {
    if (dashboardMessage) {
      console.log("Dashboard message received:", dashboardMessage);
      console.log("Weather data available:", !!dashboardMessage.weatherData);
    }
  }, [dashboardMessage]);

  // Show error toast only once when there's an edge function error
  useEffect(() => {
    if (error) {
      console.log("Dashboard message error:", error);
      // Don't show error toast to user as we have fallback data
      // This keeps the UX smooth even when there are backend issues
    }
  }, [error, toast]);

  if (isLoading || isProfileLoading) {
    return <div className="mb-6 mt-4">
        <div className="p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </div>
      </div>;
  }

  // The message already contains the appropriate greeting
  const message = dashboardMessage.message || "Welcome to your dashboard. Have a great day!";

  return (
    <div className="mb-6 mt-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-base leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
      </motion.div>
      
      {/* Weather widget always displays with fallback data if needed */}
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
