
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock } from 'lucide-react';

interface NotificationActionsProps {
  onRefresh: () => void;
  onTriggerProcess?: () => void;
  loading: boolean;
  showDevActions?: boolean;
}

export const NotificationActions = ({
  onRefresh,
  onTriggerProcess,
  loading,
  showDevActions = false
}: NotificationActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={loading}
        size="sm"
        className="flex items-center gap-1"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Refresh</span>
      </Button>
      {showDevActions && onTriggerProcess && (
        <Button 
          variant="outline" 
          onClick={onTriggerProcess}
          disabled={loading}
          size="sm"
        >
          <Clock className="h-3.5 w-3.5 mr-1" />
          Check Reminders
        </Button>
      )}
    </div>
  );
};
