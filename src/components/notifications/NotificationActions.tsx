
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, PlusCircle, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NotificationActionsProps {
  onRefresh: () => void;
  onTriggerProcess: () => void;
  onMarkAllRead: () => void;
  loading: boolean;
  showDevActions?: boolean;
}

export const NotificationActions: React.FC<NotificationActionsProps> = ({
  onRefresh,
  onTriggerProcess,
  onMarkAllRead,
  loading,
  showDevActions = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllRead}
            className="h-9"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Mark All Read
          </Button>
        </TooltipTrigger>
        <TooltipContent>Mark all notifications as read</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="h-9"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-1 hidden md:inline">Refresh</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refresh notifications</TooltipContent>
      </Tooltip>
      
      {showDevActions && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTriggerProcess}
              className="h-9"
              disabled={loading}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Process Pending</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Process pending notifications</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
