
import { updateMenuSelection } from "@/services/menuService";
import { sendEmail } from "@/services/email";
import { updateEvent, createEvent, deleteEvent } from "@/services/eventService";
import { createTask, updateTask, deleteTask } from "@/services/taskService";
import type { PendingAction } from "@/types/chat";
import type { EventCreate } from "@/types/event";
import { format, parse, isValid } from "date-fns";
import { queryClient } from "@/lib/react-query";
import { supabase } from "@/integrations/supabase/client";

export const handleChatAction = async (
  action: PendingAction,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
) => {
  try {
    console.log('Handling chat action:', action.action, action);
    
    switch (action.action) {
      case "update_event":
        if (!action.event_code || !action.updates) {
          throw new Error("Missing required fields for event update");
        }

        // Handle date updates with better validation
        if (action.updates.event_date && typeof action.updates.event_date === 'string') {
          let parsedDate;
          try {
            // Try parsing various date formats
            parsedDate = parse(action.updates.event_date, 'yyyy-MM-dd', new Date());
            if (!isValid(parsedDate)) {
              parsedDate = parse(action.updates.event_date, 'dd MMMM yyyy', new Date());
            }
            if (!isValid(parsedDate)) {
              parsedDate = parse(action.updates.event_date, 'dd/MM/yyyy', new Date());
            }
            if (!isValid(parsedDate)) {
              throw new Error("Invalid date format");
            }
            action.updates.event_date = format(parsedDate, 'yyyy-MM-dd');
          } catch (error) {
            console.error('Date parsing error:', error);
            throw new Error("Invalid date format. Please use the format 'YYYY-MM-DD' or 'DD Month YYYY'");
          }
        }

        // Handle pax updates - convert to number if it's a string
        if (action.updates.pax !== undefined) {
          if (typeof action.updates.pax === 'string') {
            const paxNum = parseInt(action.updates.pax);
            if (!isNaN(paxNum)) {
              action.updates.pax = paxNum;
            } else {
              throw new Error("Invalid guest count format. Please provide a number.");
            }
          }
        }

        // Handle venues updates - ensure it's an array
        if (action.updates.venues !== undefined) {
          if (typeof action.updates.venues === 'string') {
            // If a single venue is provided as a string, convert to array
            action.updates.venues = [action.updates.venues];
          } else if (!Array.isArray(action.updates.venues)) {
            throw new Error("Venues must be provided as a string or an array of strings");
          }
        }

        // Map contact fields from legacy names if provided
        if (action.updates.bride_name && !action.updates.primary_name) {
          action.updates.primary_name = action.updates.bride_name;
        }
        if (action.updates.bride_email && !action.updates.primary_email) {
          action.updates.primary_email = action.updates.bride_email;
        }
        if (action.updates.bride_mobile && !action.updates.primary_phone) {
          action.updates.primary_phone = action.updates.bride_mobile;
        }
        if (action.updates.groom_name && !action.updates.secondary_name) {
          action.updates.secondary_name = action.updates.groom_name;
        }
        if (action.updates.groom_email && !action.updates.secondary_email) {
          action.updates.secondary_email = action.updates.groom_email;
        }
        if (action.updates.groom_mobile && !action.updates.secondary_phone) {
          action.updates.secondary_phone = action.updates.groom_mobile;
        }
        if (action.updates.contact_person && !action.updates.primary_name) {
          action.updates.primary_name = action.updates.contact_person;
        }
        if (action.updates.contact_email && !action.updates.primary_email) {
          action.updates.primary_email = action.updates.contact_email;
        }
        if (action.updates.contact_mobile && !action.updates.primary_phone) {
          action.updates.primary_phone = action.updates.contact_mobile;
        }
        if (action.updates.company_name && !action.updates.company) {
          action.updates.company = action.updates.company_name;
        }
        if (action.updates.company_vat && !action.updates.vat_number) {
          action.updates.vat_number = action.updates.company_vat;
        }
        if (action.updates.company_address && !action.updates.address) {
          action.updates.address = action.updates.company_address;
        }
        if (action.updates.client_address && !action.updates.address) {
          action.updates.address = action.updates.client_address;
        }

        await updateEvent(action.event_code, action.updates);
        
        // Invalidate relevant queries
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
        await queryClient.invalidateQueries({ queryKey: ['events', action.event_code] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess(`Event ${action.event_code} has been updated successfully! The changes have been applied.`);
        break;

      case "update_menu":
        if (!action.event_code || !action.menu_updates) {
          throw new Error("Missing required fields for menu update");
        }
        
        // Format menu data for better handling
        if (action.menu_updates.is_custom !== undefined && typeof action.menu_updates.is_custom === 'string') {
          action.menu_updates.is_custom = action.menu_updates.is_custom.toLowerCase() === 'true';
        }

        // Handle array fields
        const arrayFields = [
          'buffet_meat_selections', 
          'buffet_vegetable_selections',
          'buffet_starch_selections',
          'karoo_starch_selection',
          'karoo_vegetable_selections',
          'canape_selections',
          'dessert_canapes',
          'individual_cakes',
          'other_selections'
        ];
        
        arrayFields.forEach(field => {
          if (action.menu_updates[field] !== undefined) {
            if (typeof action.menu_updates[field] === 'string') {
              // If a single item is provided as a string, convert to array
              action.menu_updates[field] = [action.menu_updates[field]];
            } else if (!Array.isArray(action.menu_updates[field])) {
              console.warn(`Invalid ${field} format, expected array or string`);
              delete action.menu_updates[field]; // Remove invalid data
            }
          }
        });
        
        await updateMenuSelection(action.event_code, action.menu_updates);
        await queryClient.invalidateQueries({ queryKey: ['events', action.event_code] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
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
        
        // Invalidate events queries after creation
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Event created successfully!");
        break;

      case "delete_event":
        if (!action.event_code) {
          throw new Error("Missing event code");
        }
        await deleteEvent(action.event_code);
        
        // Invalidate events queries after deletion
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Event deleted successfully!");
        break;

      case "create_task":
        if (!action.task_data) {
          throw new Error("Missing task data");
        }
        
        // Ensure the task has a title
        if (!action.task_data.title) {
          throw new Error("Task must have a title");
        }
        
        await createTask(action.task_data);
        
        // Invalidate tasks queries
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Task created successfully!");
        break;

      case "update_task":
        if (!action.task_id || !action.updates) {
          throw new Error("Missing required fields for task update");
        }
        
        // Special handling for notes
        if (action.updates.notes) {
          const { data: task } = await supabase
            .from('tasks')
            .select('notes')
            .eq('id', action.task_id)
            .single();
            
          const updatedNotes = [...(task?.notes || []), action.updates.notes];
          action.updates.notes = updatedNotes;
        }
        
        await updateTask(action.task_id, action.updates);
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        onSuccess("Task updated successfully!");
        break;

      case "delete_task":
        if (!action.task_id) {
          throw new Error("Missing task ID");
        }
        await deleteTask(action.task_id);
        
        // Invalidate tasks queries
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Task deleted successfully!");
        break;

      case "update_document":
        if (!action.document_id || !action.updates) {
          throw new Error("Missing required fields for document update");
        }
        
        const { error: docUpdateError } = await supabase
          .from('documents')
          .update(action.updates)
          .eq('id', action.document_id);
        
        if (docUpdateError) throw docUpdateError;
        
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Document updated successfully!");
        break;
        
      case "update_contact":
        if (!action.contact_id || !action.updates) {
          throw new Error("Missing required fields for contact update");
        }
        
        const { error: contactUpdateError } = await supabase
          .from('profiles')
          .update(action.updates)
          .eq('id', action.contact_id);
        
        if (contactUpdateError) throw contactUpdateError;
        
        await queryClient.invalidateQueries({ queryKey: ['profiles'] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess("Contact updated successfully!");
        break;

      default:
        throw new Error(`Unknown action type: ${action.action}`);
    }
  } catch (error) {
    console.error('Error handling chat action:', error);
    onError(error as Error);
  }
};
