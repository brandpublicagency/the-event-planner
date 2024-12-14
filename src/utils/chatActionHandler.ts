import { updateMenuSelection } from "@/services/menuService";
import { sendEmail } from "@/services/email";
import { updateEvent, createEvent, deleteEvent } from "@/services/eventService";
import { createTask, updateTask, deleteTask } from "@/services/taskService";
import type { PendingAction } from "@/types/chat";
import type { EventCreate } from "@/types/event";

export const handleChatAction = async (
  action: PendingAction,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
) => {
  try {
    switch (action.action) {
      case "update_event":
        if (!action.event_code || !action.updates) {
          throw new Error("Missing required fields for event update");
        }
        await updateEvent(action.event_code, action.updates);
        onSuccess(`Event ${action.event_code} has been updated successfully!`);
        break;

      case "update_menu":
        if (!action.event_code || !action.menu_updates) {
          throw new Error("Missing required fields for menu update");
        }
        await updateMenuSelection(action.event_code, action.menu_updates);
        onSuccess("Menu updated successfully!");
        break;

      case "send_email":
        if (!action.to || !action.subject || !action.content) {
          throw new Error("Missing required fields for email");
        }
        await sendEmail(action.to, action.subject, action.content);
        onSuccess("Email sent successfully!");
        break;

      case "create_event":
        if (!action.event_data) {
          throw new Error("Missing event data");
        }
        const eventData = action.event_data as EventCreate;
        await createEvent(eventData);
        onSuccess("Event created successfully!");
        break;

      case "delete_event":
        if (!action.event_code) {
          throw new Error("Missing event code");
        }
        await deleteEvent(action.event_code);
        onSuccess("Event deleted successfully!");
        break;

      case "create_task":
        if (!action.task_data) {
          throw new Error("Missing task data");
        }
        await createTask(action.task_data);
        onSuccess("Task created successfully!");
        break;

      case "update_task":
        if (!action.task_id || !action.updates) {
          throw new Error("Missing required fields for task update");
        }
        await updateTask(action.task_id, action.updates);
        onSuccess("Task updated successfully!");
        break;

      case "delete_task":
        if (!action.task_id) {
          throw new Error("Missing task ID");
        }
        await deleteTask(action.task_id);
        onSuccess("Task deleted successfully!");
        break;

      default:
        throw new Error("Unknown action type");
    }
  } catch (error) {
    onError(error as Error);
  }
};