import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, AlarmClock } from 'lucide-react';
import { Notification } from '@/types/notification';
import { NotificationsList } from './NotificationList';

interface NotificationTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  generalNotifications: Notification[];
  scheduledNotifications: Notification[];
  generalLoading: boolean;
  scheduledLoading: boolean;
  onViewDetail: (type: 'general' | 'scheduled', id: string, eventCode?: string) => void;
  onCompleteTask: (type: 'general' | 'scheduled', id: string) => void;
}

export const NotificationTabs = ({
  activeTab,
  onTabChange,
  generalNotifications,
  scheduledNotifications,
  generalLoading,
  scheduledLoading,
  onViewDetail,
  onCompleteTask
}: NotificationTabsProps) => {
  const generalUnreadCount = generalNotifications.filter(n => !n.read).length;
  const scheduledUnreadCount = scheduledNotifications.filter(n => !n.read).length;

  return (
    <Tabs 
      defaultValue={activeTab} 
      onValueChange={onTabChange} 
      className="mt-2"
    >
      <TabsList className="w-full max-w-md mx-auto mb-6 grid grid-cols-2">
        <TabsTrigger 
          value="general" 
          className="flex items-center gap-1.5"
        >
          <Bell className="h-4 w-4" />
          <span>General</span>
          {generalUnreadCount > 0 && (
            <Badge variant="red" className="ml-1 rounded-[4px] w-5 h-5 min-w-[20px] flex items-center justify-center">
              {generalUnreadCount}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger 
          value="scheduled" 
          className="flex items-center gap-1.5"
        >
          <AlarmClock className="h-4 w-4" />
          <span>Reminders</span>
          {scheduledUnreadCount > 0 && (
            <Badge variant="red" className="ml-1 rounded-[4px] w-5 h-5 min-w-[20px] flex items-center justify-center">
              {scheduledUnreadCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <NotificationsList 
          notifications={generalNotifications}
          loading={generalLoading}
          onViewDetail={(id, relatedId) => onViewDetail('general', id, relatedId)}
          onCompleteTask={(id) => onCompleteTask('general', id)}
          listType="general"
        />
      </TabsContent>

      <TabsContent value="scheduled">
        <NotificationsList 
          notifications={scheduledNotifications}
          loading={scheduledLoading}
          onViewDetail={(id, relatedId) => onViewDetail('scheduled', id, relatedId)}
          onCompleteTask={(id) => onCompleteTask('scheduled', id)}
          listType="scheduled"
        />
      </TabsContent>
    </Tabs>
  );
};
