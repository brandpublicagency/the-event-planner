
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { getEventDetails, getUpcomingEventsList } from './event/index.ts';
import { getTaskDetails, getTodoList } from './taskHandler.ts';
import { getEventMenusList, getEventMenuDetails } from './menuHandler.ts';
import { WhatsAppResponse } from '../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handleListSelection = async (buttonId: string): Promise<WhatsAppResponse> => {
  console.log('Handling list selection:', buttonId);
  
  try {
    // Handle task selection
    if (buttonId.startsWith('task_')) {
      const taskId = buttonId.replace('task_', '');
      return await getTaskDetails(taskId);
    }

    switch (buttonId) {
      case 'upcoming_events':
        return await getUpcomingEventsList();
      case 'event_menus':
        return await getEventMenusList();
      case 'todo_list':
        return await getTodoList();
      default:
        if (buttonId.startsWith('event_')) {
          const eventCode = buttonId.replace('event_', '');
          return await getEventDetails(eventCode);
        }
        if (buttonId.startsWith('menu_')) {
          const eventCode = buttonId.replace('menu_', '');
          return await getEventMenuDetails(eventCode);
        }
        
        console.error('Invalid selection ID:', buttonId);
        return {
          type: 'text',
          message: "Invalid selection. Please try again or type 'help' for available commands."
        };
    }
  } catch (error) {
    console.error('Error in handleListSelection:', error);
    return {
      type: 'text',
      message: "An error occurred while processing your selection. Please try again."
    };
  }
};
