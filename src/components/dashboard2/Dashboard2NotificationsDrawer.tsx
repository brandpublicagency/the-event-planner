import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDashboardNotifications } from "@/components/dashboard/notifications/useDashboardNotifications";
import { Bell, CheckCheck, Eye, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Dashboard2NotificationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Dashboard2NotificationsDrawer = ({ open, onOpenChange }: Dashboard2NotificationsDrawerProps) => {
  const {
    notifications,
    handleNotificationView,
    handleMarkAllAsRead,
    unreadCount,
  } = useDashboardNotifications();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground">({unreadCount} unread)</span>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map(notification => (
                <button
                  key={notification.id}
                  onClick={(e) => handleNotificationView(notification, e)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 transition-colors flex gap-3",
                    !notification.read && "bg-primary/[0.03]"
                  )}
                >
                  <div className="shrink-0 mt-0.5">
                    {!notification.read ? (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-transparent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm text-foreground",
                      !notification.read ? "font-medium" : "font-normal"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Dashboard2NotificationsDrawer;
