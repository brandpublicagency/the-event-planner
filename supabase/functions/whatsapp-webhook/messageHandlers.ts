
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { handleMessage } from './handlers/messageHandler.ts';
import { 
  getEventDetails, 
  getUpcomingEventsList, 
  getCalendarView 
} from './handlers/event/index.ts';
import { getTaskDetails, getNextTask } from './handlers/task/index.ts';
import { getWelcomeMessage, getHelpMessage } from './handlers/welcomeHandler.ts';
import { handleAIQuestion } from './handlers/questionHandler.ts';

// Re-export the handlers for backward compatibility
export { 
  handleMessage,
  getEventDetails, 
  getUpcomingEventsList, 
  getCalendarView,
  getTaskDetails,
  getWelcomeMessage, 
  getHelpMessage 
};

// This file is kept for backward compatibility
// All functionality has been moved to dedicated handler files
