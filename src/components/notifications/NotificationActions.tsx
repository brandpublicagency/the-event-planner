
import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { RefreshCw, Bell, PlayCircle } from "lucide-react";

interface NotificationActionsProps {
  onRefresh: () => void;
  onTriggerProcess: () => void;
  onMarkAllRead: () => void;
  loading?: boolean;
  showDevActions?: boolean;
}

export const NotificationActions: React.FC<NotificationActionsProps> = ({
  onRefresh,
  onTriggerProcess,
  onMarkAllRead,
  loading = false,
  showDevActions = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onMarkAllRead}
        className="h-8 text-xs"
      >
        <Bell className="h-4 w-4 mr-1" />
        Mark All Read
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading}
        className="h-8 text-xs"
      >
        {loading ? <Spinner className="h-4 w-4 mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
        Refresh
      </Button>
      
      {showDevActions && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onTriggerProcess}
                className="h-8 text-xs"
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Process
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Manually trigger notification processing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
