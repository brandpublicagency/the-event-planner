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

        console.log('Updating event with code:', action.event_code, 'Updates:', action.updates);

        // Fix nested updates structure if it exists
        let updatesToApply = { ...action.updates };
        
        // Check for nested updates object (remove this nesting)
        if (updatesToApply.event_code && updatesToApply.updates) {
          console.log('Detected nested updates structure, fixing...');
          updatesToApply = { ...updatesToApply.updates };
        }

        // Handle venue updates - ensure it's an array
        if (updatesToApply.venues !== undefined) {
          if (typeof updatesToApply.venues === 'string') {
            console.log('Converting venue string to array:', updatesToApply.venues);
            // If a single venue is provided as a string, convert to array
            updatesToApply.venues = [updatesToApply.venues];
          } else if (!Array.isArray(updatesToApply.venues)) {
            throw new Error("Venues must be provided as a string or an array of strings");
          }
          
          // Validate venue values
          const allowedVenues = [
            "The Kitchen", "The Gallery", "The Grand Hall", 
            "Package 1", "Package 2", "Package 3"
          ];
          
          const invalidVenues = updatesToApply.venues.filter(
            (v: string) => !allowedVenues.includes(v)
          );
          
          if (invalidVenues.length > 0) {
            throw new Error(
              `Invalid venue(s): ${invalidVenues.join(', ')}. Valid options are: ${allowedVenues.join(', ')}`
            );
          }
        }

        // Handle date updates with better validation
        if (updatesToApply.event_date && typeof updatesToApply.event_date === 'string') {
          let parsedDate;
          try {
            // Try parsing various date formats
            parsedDate = parse(updatesToApply.event_date, 'yyyy-MM-dd', new Date());
            if (!isValid(parsedDate)) {
              parsedDate = parse(updatesToApply.event_date, 'dd MMMM yyyy', new Date());
            }
            if (!isValid(parsedDate)) {
              parsedDate = parse(updatesToApply.event_date, 'dd/MM/yyyy', new Date());
            }
            if (!isValid(parsedDate)) {
              throw new Error("Invalid date format");
            }
            updatesToApply.event_date = format(parsedDate, 'yyyy-MM-dd');
          } catch (error) {
            console.error('Date parsing error:', error);
            throw new Error("Invalid date format. Please use the format 'YYYY-MM-DD' or 'DD Month YYYY'");
          }
        }

        // Handle pax updates - convert to number if it's a string
        if (updatesToApply.pax !== undefined) {
          if (typeof updatesToApply.pax === 'string') {
            const paxNum = parseInt(updatesToApply.pax);
            if (!isNaN(paxNum)) {
              updatesToApply.pax = paxNum;
            } else {
              throw new Error("Invalid guest count format. Please provide a number.");
            }
          }
        }

        // Map contact fields from legacy names if provided
        if (updatesToApply.bride_name && !updatesToApply.primary_name) {
          updatesToApply.primary_name = updatesToApply.bride_name;
        }
        if (updatesToApply.bride_email && !updatesToApply.primary_email) {
          updatesToApply.primary_email = updatesToApply.bride_email;
        }
        if (updatesToApply.bride_mobile && !updatesToApply.primary_phone) {
          updatesToApply.primary_phone = updatesToApply.bride_mobile;
        }
        if (updatesToApply.groom_name && !updatesToApply.secondary_name) {
          updatesToApply.secondary_name = updatesToApply.groom_name;
        }
        if (updatesToApply.groom_email && !updatesToApply.secondary_email) {
          updatesToApply.secondary_email = updatesToApply.groom_email;
        }
        if (updatesToApply.groom_mobile && !updatesToApply.secondary_phone) {
          updatesToApply.secondary_phone = updatesToApply.groom_mobile;
        }
        if (updatesToApply.contact_person && !updatesToApply.primary_name) {
          updatesToApply.primary_name = updatesToApply.contact_person;
        }
        if (updatesToApply.contact_email && !updatesToApply.primary_email) {
          updatesToApply.primary_email = updatesToApply.contact_email;
        }
        if (updatesToApply.contact_mobile && !updatesToApply.primary_phone) {
          updatesToApply.primary_phone = updatesToApply.contact_mobile;
        }
        if (updatesToApply.company_name && !updatesToApply.company) {
          updatesToApply.company = updatesToApply.company_name;
        }
        if (updatesToApply.company_vat && !updatesToApply.vat_number) {
          updatesToApply.vat_number = updatesToApply.company_vat;
        }
        if (updatesToApply.company_address && !updatesToApply.address) {
          updatesToApply.address = updatesToApply.company_address;
        }
        if (updatesToApply.client_address && !updatesToApply.address) {
          updatesToApply.address = updatesToApply.client_address;
        }

        // Log the final updates being applied
        console.log('Final updates to apply:', updatesToApply);

        // Make the actual update call
        const updatedEvent = await updateEvent(action.event_code, updatesToApply);
        console.log('Event updated successfully:', updatedEvent);
        
        // Invalidate relevant queries
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        await queryClient.invalidateQueries({ queryKey: ['upcoming_events'] });
        await queryClient.invalidateQueries({ queryKey: ['events', action.event_code] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        onSuccess(`Event ${action.event_code} has been updated successfully! The changes have been applied.`);
        break;

      case "update_menu":
        if (!action.event_code) {
          throw new Error("Missing event code for menu update");
        }
        
        if (!action.menu_updates || typeof action.menu_updates !== 'object') {
          throw new Error("Missing or invalid menu update data");
        }
        
        console.log('Updating menu for event:', action.event_code, 'Menu updates:', action.menu_updates);
        
        // Format menu data for better handling
        const processedMenuUpdates = { ...action.menu_updates };
        
        if (processedMenuUpdates.is_custom !== undefined && typeof processedMenuUpdates.is_custom === 'string') {
          processedMenuUpdates.is_custom = processedMenuUpdates.is_custom.toLowerCase() === 'true';
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
          if (processedMenuUpdates[field] !== undefined) {
            if (typeof processedMenuUpdates[field] === 'string') {
              // If a single item is provided as a string, convert to array
              processedMenuUpdates[field] = [processedMenuUpdates[field]];
              console.log(`Converted ${field} string to array:`, processedMenuUpdates[field]);
            } else if (!Array.isArray(processedMenuUpdates[field])) {
              console.warn(`Invalid ${field} format, expected array or string`);
              delete processedMenuUpdates[field]; // Remove invalid data
            }
          }
        });
        
        await updateMenuSelection(action.event_code, processedMenuUpdates);
        await queryClient.invalidateQueries({ queryKey: ['events', action.event_code] });
        await queryClient.invalidateQueries({ queryKey: ['chat-context'] });
        
        // Build a descriptive success message
        let successDetails = '';
        if (processedMenuUpdates.starter_type) {
          successDetails += `starter (${processedMenuUpdates.starter_type}), `;
        }
        if (processedMenuUpdates.main_course_type) {
          successDetails += `main course (${processedMenuUpdates.main_course_type}), `;
        }
        if (processedMenuUpdates.dessert_type) {
          successDetails += `dessert (${processedMenuUpdates.dessert_type}), `;
        }
        if (processedMenuUpdates.notes) {
          successDetails += 'notes, ';
        }
        
        // Remove trailing comma and space
        if (successDetails) {
          successDetails = successDetails.replace(/, $/, '');
          onSuccess(`Menu updated successfully! Updated ${successDetails}.`);
        } else {
          onSuccess("Menu updated successfully!");
        }
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
