
import { useEffect, useState } from "react";
import { getEntityHistory, UserActivity } from "@/services/userLogService";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

interface EntityHistoryListProps {
  entityType: string;
  entityId: string;
  limit?: number;
  className?: string;
}

export function EntityHistoryList({ 
  entityType, 
  entityId, 
  limit = 10,
  className 
}: EntityHistoryListProps) {
  const [history, setHistory] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!entityId) return;
      
      setIsLoading(true);
      try {
        const data = await getEntityHistory(entityType, entityId, limit);
        setHistory(data);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [entityType, entityId, limit]);

  if (isLoading) {
    return (
      <div className={`flex justify-center p-4 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`text-sm text-muted-foreground ${className}`}>
        No history available
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-sm font-medium mb-2">Activity History</h3>
      <ul className="space-y-2 text-sm">
        {history.map((item) => (
          <li key={item.id} className="flex justify-between">
            <div>
              <span className="font-medium">{item.user_name}</span>{" "}
              <span>{item.action}</span>
              {item.details?.fields_updated && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({item.details.fields_updated.join(", ")})
                </span>
              )}
            </div>
            {item.timestamp && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
