
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivityList } from "@/components/activity/RecentActivityList";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

interface RecentActivityWidgetProps {
  limit?: number;
  className?: string;
}

export function RecentActivityWidget({ limit = 10, className }: RecentActivityWidgetProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className={`col-span-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Team Activity</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2" 
          onClick={handleRefresh}
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <RecentActivityList key={refreshKey} limit={limit} />
      </CardContent>
    </Card>
  );
}
