
import { useEffect, useState } from "react";
import { getRecentActivities, UserActivity } from "@/services/userLogService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

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
      const data = await getRecentActivities(limit);
      setActivities(data);
      setIsLoading(false);
    };

    fetchActivities();
    
    // Set up polling to refresh activities every 30 seconds
    const intervalId = setInterval(fetchActivities, 30000);
    
    return () => clearInterval(intervalId);
  }, [limit]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-start gap-2 text-sm">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-medium">{activity.user_name.charAt(0)}</span>
                </div>
                <div>
                  <p>
                    <span className="font-medium">{activity.user_name}</span>{" "}
                    <span>{activity.action}</span>{" "}
                    <span className="font-medium">{activity.entity_type}</span>
                    {activity.details?.title && (
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
        )}
      </CardContent>
    </Card>
  );
}
