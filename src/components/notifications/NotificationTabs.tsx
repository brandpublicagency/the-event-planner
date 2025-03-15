
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, AlarmClock } from 'lucide-react';
import { Notification } from '@/types/notification';
import { NotificationList } from './NotificationList';

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

  // Auto-switch to tab with unread items if current tab has none
  useEffect(() => {
    if (activeTab === 'general' && generalUnreadCount === 0 && scheduledUnreadCount > 0) {
      onTabChange('scheduled');
    } else if (activeTab === 'scheduled' && scheduledUnreadCount === 0 && generalUnreadCount > 0) {
      onTabChange('general');
    }
  }, [activeTab, generalUnreadCount, scheduledUnreadCount, onTabChange]);

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="mt-6"
    >
      <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-2">
        <TabsTrigger 
          value="general" 
          className={`flex items-center gap-1.5 ${generalUnreadCount > 0 && activeTab !== 'general' ? 'animate-pulse' : ''}`}
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
          className={`flex items-center gap-1.5 ${scheduledUnreadCount > 0 && activeTab !== 'scheduled' ? 'animate-pulse' : ''}`}
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
        <NotificationList 
          notifications={generalNotifications}
          loading={generalLoading}
          onViewDetail={(id, relatedId) => onViewDetail('general', id, relatedId)}
          onCompleteTask={(id) => onCompleteTask('general', id)}
          listType="general"
        />
      </TabsContent>

      <TabsContent value="scheduled">
        <NotificationList 
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
