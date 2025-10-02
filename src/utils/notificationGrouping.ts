import { Notification } from '@/types/notification';

export interface GroupedNotification {
  id: string;
  type: string;
  notifications: Notification[];
  count: number;
  latestTimestamp: Date;
  title: string;
  isExpanded?: boolean;
}

export function groupNotifications(notifications: Notification[]): (Notification | GroupedNotification)[] {
  const groups = new Map<string, Notification[]>();
  const singles: Notification[] = [];

  // Group by type and time window (1 hour)
  notifications.forEach(notification => {
    const key = `${notification.type}`;
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    
    groups.get(key)!.push(notification);
  });

  const result: (Notification | GroupedNotification)[] = [];

  // Process groups
  groups.forEach((notifs, key) => {
    if (notifs.length > 3) {
      // Create grouped notification
      const grouped: GroupedNotification = {
        id: `group-${key}`,
        type: key,
        notifications: notifs,
        count: notifs.length,
        latestTimestamp: new Date(Math.max(...notifs.map(n => n.createdAt.getTime()))),
        title: getGroupTitle(key, notifs.length),
        isExpanded: false,
      };
      result.push(grouped);
    } else {
      // Add individually
      result.push(...notifs);
    }
  });

  // Sort by timestamp
  return result.sort((a, b) => {
    const timeA = 'latestTimestamp' in a ? a.latestTimestamp.getTime() : a.createdAt.getTime();
    const timeB = 'latestTimestamp' in b ? b.latestTimestamp.getTime() : b.createdAt.getTime();
    return timeB - timeA;
  });
}

function getGroupTitle(type: string, count: number): string {
  switch (type) {
    case 'event_created':
      return `${count} new events created`;
    case 'task_created':
      return `${count} new tasks assigned`;
    case 'task_completed':
      return `${count} tasks completed`;
    case 'event_updated':
      return `${count} events updated`;
    default:
      return `${count} notifications`;
  }
}

export function isGroupedNotification(item: Notification | GroupedNotification): item is GroupedNotification {
  return 'notifications' in item && 'count' in item;
}
