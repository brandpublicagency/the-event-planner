import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScheduledNotifications } from '@/contexts/ScheduledNotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  RefreshCw, 
  Bell, 
  AlarmClock, 
  Clock,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { 
    notifications: scheduledNotifications, 
    markAsRead: markScheduledAsRead, 
    markAsCompleted,
    refreshNotifications,
    triggerNotificationProcessing,
    loading
  } = useScheduledNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleViewEvent = (type: 'general' | 'scheduled', id: string, eventCode?: string) => {
    // Mark notification as read
    if (type === 'general') {
      markAsRead(id);
    } else {
      markScheduledAsRead(id);
    }
    
    // Navigate to event if we have an event code
    if (eventCode) {
      navigate(`/events/${eventCode}`);
    }
    
    toast({
      title: "Notification marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  };

  const handleCompleteTask = (id: string) => {
    markAsCompleted(id);
    toast({
      title: "Task marked as complete",
      description: "The task has been marked as completed successfully",
      variant: "success",
      showProgress: true,
      duration: 3000
    });
  };

  const handleRefresh = () => {
    refreshNotifications();
    toast({
      title: "Refreshing notifications",
      description: "Fetching the latest notifications",
      showProgress: true,
      duration: 3000
    });
  };

  const handleTriggerProcess = () => {
    triggerNotificationProcessing();
    toast({
      title: "Processing notifications",
      description: "Checking for scheduled notifications",
      showProgress: true,
      duration: 3000
    });
  };

  return (
    <div className="container py-6 max-w-5xl">
      <PageHeader
        pageTitle="Notifications"
        actionButton={
          activeTab === 'general' && notifications.some(n => !n.read) 
            ? {
                label: "Mark All Read",
                onClick: handleMarkAllRead,
              }
            : undefined
        }
        secondaryAction={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                onClick={handleTriggerProcess}
                disabled={loading}
                size="sm"
              >
                <Clock className="h-3.5 w-3.5 mr-1" />
                Check Reminders
              </Button>
            )}
          </div>
        }
      />

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="mt-6"
      >
        <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-1.5">
            <Bell className="h-4 w-4" />
            <span>General</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="red" className="ml-1">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-1.5">
            <AlarmClock className="h-4 w-4" />
            <span>Reminders</span>
            {scheduledNotifications.filter(n => !n.read).length > 0 && (
              <Badge variant="red" className="ml-1">
                {scheduledNotifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin" />
                <p className="mt-4 text-zinc-500">Loading notifications...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Bell className="h-10 w-10 text-zinc-300" />
                  <h3 className="text-lg font-medium text-zinc-900">No notifications</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">
                    You don't have any notifications yet. They'll appear here when there are updates to your events or tasks.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {notifications.map(notification => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${notification.read ? "opacity-70 border-zinc-100" : "border-zinc-200"}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="text-base font-medium text-zinc-900">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="red" className="ml-2">
                                New
                              </Badge>
                            )}
                            {notification.type === "event_incomplete" && (
                              <Badge variant="outline" className="ml-2 border-orange-200 bg-orange-50 text-orange-700 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Attention needed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 mb-3">{notification.description}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleViewEvent('general', notification.id, notification.relatedId)} 
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                              
                              {notification.actionType === "approve" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleCompleteTask(notification.id)}
                                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                              )}
                            </div>
                            
                            <span className="text-xs text-zinc-500">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin" />
                <p className="mt-4 text-zinc-500">Loading reminders...</p>
              </div>
            </div>
          ) : scheduledNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <AlarmClock className="h-10 w-10 text-zinc-300" />
                  <h3 className="text-lg font-medium text-zinc-900">No scheduled reminders</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">
                    You don't have any reminders scheduled. They'll appear here when you have upcoming tasks or deadlines.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-240px)]">
              <div className="space-y-4 pr-4">
                {scheduledNotifications.map(notification => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all ${notification.read ? "opacity-70 border-zinc-100" : "border-zinc-200"}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="text-base font-medium text-zinc-900">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="ml-2 bg-zinc-900 text-white text-xs font-normal">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 mb-3">{notification.description}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleViewEvent('scheduled', notification.id, notification.relatedId)} 
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs"
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                View Event
                              </Button>
                              
                              {notification.actionType === "approve" && (
                                <Button 
                                  size="sm"
                                  onClick={() => handleCompleteTask(notification.id)}
                                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                            
                            <span className="text-xs text-zinc-500">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
