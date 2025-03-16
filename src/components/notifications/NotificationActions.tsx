
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Play, MailCheck } from 'lucide-react';

interface NotificationActionsProps {
  onRefresh: () => void;
  onTriggerProcess: () => void;
  loading: boolean;
  showDevActions: boolean;
}

export const NotificationActions = ({
  onRefresh,
  onTriggerProcess,
  loading,
  showDevActions = true, // Enable by default for now to help with testing
}: NotificationActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      
      {showDevActions && (
        <Button 
          size="sm" 
          variant="default"
          onClick={onTriggerProcess}
          disabled={loading}
        >
          <Play className="h-4 w-4 mr-2" />
          Process Reminders
        </Button>
      )}
    </div>
  );
};
