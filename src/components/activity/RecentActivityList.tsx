
import { useQuery } from "@tanstack/react-query";
import { getRecentActivities, UserActivity } from "@/services/userLogService";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentActivityListProps {
  limit?: number;
}

export function RecentActivityList({ limit = 10 }: RecentActivityListProps) {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: () => getRecentActivities(limit),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 items-start">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground p-4">
        Failed to load activities. Please try again.
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No recent activity found.
      </div>
    );
  }

  const getActivityIcon = (activity: UserActivity) => {
    const initials = activity.user_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
    
    return (
      <Avatar className="h-10 w-10">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    );
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 items-start">
          {getActivityIcon(activity)}
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{activity.user_name}</span>
              <Badge variant="secondary" className={getActionColor(activity.action)}>
                {activity.action}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {activity.entity_type}: {activity.details?.title || activity.details?.name || activity.entity_id}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {activity.timestamp ? format(new Date(activity.timestamp), 'PPpp') : 'Just now'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
