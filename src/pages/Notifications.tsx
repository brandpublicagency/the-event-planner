
import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { useScheduledNotifications } from '@/contexts/ScheduledNotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, RefreshCw, Bell, AlarmClock } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();

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
  };

  return (
    <div className="container py-6">
      <PageHeader
        title="Notifications"
        description="View and manage all your notifications"
        actions={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refreshNotifications}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                onClick={triggerNotificationProcessing}
                disabled={loading}
              >
                Check Reminders
              </Button>
            )}
            <Button 
              variant="default" 
              onClick={() => activeTab === 'general' ? markAllAsRead() : null}
              disabled={activeTab === 'general' ? notifications.every(n => n.read) : false}
            >
              Mark All Read
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="general" className="flex-1">
            <Bell className="h-4 w-4 mr-2" />
            General Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-zinc-200">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1">
            <AlarmClock className="h-4 w-4 mr-2" />
            Scheduled Reminders
            {scheduledNotifications.filter(n => !n.read).length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-zinc-200">
                {scheduledNotifications.filter(n => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No notifications yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="ml-2 bg-blue-500">New</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-zinc-700 mb-4">{notification.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={() => handleViewEvent('general', notification.id, notification.relatedId)} 
                        variant="outline"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Loading reminders...
              </CardContent>
            </Card>
          ) : scheduledNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No scheduled reminders
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scheduledNotifications.map(notification => (
                <Card key={notification.id} className={notification.read ? "opacity-80" : ""}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <Badge className="ml-2 bg-blue-500">New</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-zinc-700 mb-4">{notification.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={() => handleViewEvent('scheduled', notification.id, notification.relatedId)} 
                        variant="outline"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        View Event
                      </Button>
                      {notification.actionType === "approve" && (
                        <Button 
                          onClick={() => markAsCompleted(notification.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
