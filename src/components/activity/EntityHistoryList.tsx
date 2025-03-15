
import { useEffect, useState } from "react";
import { getEntityHistory } from "@/services/userLogService";
import { formatDistanceToNow } from "date-fns";

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
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!entityId) return;
      
      setIsLoading(true);
      const data = await getEntityHistory(entityType, entityId, limit);
      setHistory(data);
      setIsLoading(false);
    };

    fetchHistory();
  }, [entityType, entityId, limit]);

  if (isLoading) {
    return (
      <div className={`flex justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
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
