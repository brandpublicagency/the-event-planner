
import { Notification } from "@/types/notification";
import { NavigateFunction } from "react-router-dom";

/**
 * Shared navigation logic for notification click-through.
 * Navigates to the appropriate page based on the notification's relatedId.
 */
export const navigateToNotificationTarget = (
  notification: Notification,
  navigate: NavigateFunction
): void => {
  if (!notification.relatedId) {
    navigate('/notifications');
    return;
  }

  const { relatedId } = notification;

  // Event code patterns: "123-456", "EVENT-xxx", "event_xxx", "COR-2503-780"
  if (
    relatedId.match(/^\d+-\d+$/) ||
    relatedId.startsWith('EVENT-') ||
    relatedId.startsWith('event_') ||
    relatedId.match(/^[A-Z]+-\d+-\d+$/)
  ) {
    if (window.location.pathname === `/events/${relatedId}`) {
      window.location.href = `/events/${relatedId}`;
    } else {
      navigate(`/events/${relatedId}`);
    }
  } else if (relatedId.startsWith('task_')) {
    navigate(`/tasks?selected=${relatedId}`);
  } else {
    navigate(`/${relatedId}`);
  }
};
