import { updateMenuSelection } from "@/services/menuService";
import { sendEmail } from "@/services/email";
import { updateEvent, createEvent, deleteEvent } from "@/services/eventService";
import { createTask, updateTask, deleteTask } from "@/services/taskService";
import type { PendingAction } from "@/types/chat";

export const handleChatAction = async (
  action: PendingAction,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
) => {
  try {
    switch (action.action) {
      case "update_event":
        await updateEvent(action.event_code, action.updates);
        onSuccess(`Event ${action.event_code} has been updated successfully!`);
        break;
      case "update_menu":
        await updateMenuSelection(action.event_code, action.menu_updates);
        onSuccess("Menu updated successfully!");
        break;
      case "send_email":
        await sendEmail(action.to, action.subject, action.content);
        onSuccess("Email sent successfully!");
        break;
      case "create_event":
        await createEvent(action.event_data);
        onSuccess("Event created successfully!");
        break;
      case "delete_event":
        await deleteEvent(action.event_code);
        onSuccess("Event deleted successfully!");
        break;
      case "create_task":
        await createTask(action.task_data);
        onSuccess("Task created successfully!");
        break;
      case "update_task":
        await updateTask(action.task_id, action.updates);
        onSuccess("Task updated successfully!");
        break;
      case "delete_task":
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