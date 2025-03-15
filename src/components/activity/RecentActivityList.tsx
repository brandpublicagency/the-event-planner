
import { useEffect, useState } from "react";
import { getRecentActivities, UserActivity } from "@/services/userLogService";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface RecentActivityListProps {
  limit?: number;
  className?: string;
}

export function RecentActivityList({ limit = 5, className }: RecentActivityListProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await getRecentActivities(limit);
        setActivities(data);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    
    // Set up polling to refresh activities every 30 seconds
    const intervalId = setInterval(fetchActivities, 30000);
    
    return () => clearInterval(intervalId);
  }, [limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4 text-center">
        No recent activity
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {activities.map((activity) => (
        <li key={activity.id} className="flex items-start gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <span className="font-medium">{activity.user_name.charAt(0)}</span>
          </div>
          <div className="space-y-1">
            <p>
              <span className="font-medium">{activity.user_name}</span>{" "}
              <span>{activity.action}</span>{" "}
              <span className="font-medium">{activity.entity_type}</span>
              {activity.details?.name && (
                <>: <span className="italic">{activity.details.name}</span></>
              )}
              {activity.details?.title && !activity.details?.name && (
                <>: <span className="italic">{activity.details.title}</span></>
              )}
            </p>
            {activity.timestamp && (
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
