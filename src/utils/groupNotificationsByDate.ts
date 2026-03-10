
import { Notification } from "@/types/notification";
import { isToday, isYesterday, isThisWeek, startOfDay } from "date-fns";

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

export const groupNotificationsByDate = (
  notifications: Notification[]
): NotificationGroup[] => {
  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);
    if (isToday(date)) {
      groups["Today"].push(notification);
    } else if (isYesterday(date)) {
      groups["Yesterday"].push(notification);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      groups["This Week"].push(notification);
    } else {
      groups["Older"].push(notification);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, notifications: items }));
};
