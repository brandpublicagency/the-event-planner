
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface WhatsAppMessage {
  type: string;
  text?: {
    body: string;
  };
  interactive?: any;
}

export const handleMessage = async (message: WhatsAppMessage) => {
  try {
    if (message.type === 'text') {
      const messageText = message.text?.body.toLowerCase().trim() || '';

      // Handle greetings
      if (['hi', 'hello', 'hey'].includes(messageText)) {
        return {
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: 'Welcome! How can I help?'
            },
            body: {
              text: 'Please select an option:'
            },
            action: {
              button: 'View Options',
              sections: [{
                title: 'Event Management',
                rows: [
                  { 
                    id: 'upcoming_events', 
                    title: 'Upcoming Events',
                    description: 'View all upcoming events'
                  },
                  { 
                    id: 'todo_list', 
                    title: 'Your To-do List',
                    description: 'View your pending tasks'
                  }
                ]
              }]
            }
          }
        };
      }

      // Handle upcoming events query
      if (messageText.includes('upcoming events')) {
        const { data: events, error } = await supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(5);

        if (error) throw error;

        if (!events?.length) {
          return {
            type: 'text',
            message: "No upcoming events found."
          };
        }

        const eventsList = events
          .map(event => `📅 ${format(new Date(event.event_date), 'dd MMM yyyy')} - ${event.name}`)
          .join('\n');

        return {
          type: 'text',
          message: `Upcoming Events:\n\n${eventsList}`
        };
      }

      // Handle tasks query
      if (messageText.includes('tasks') || messageText.includes('todo')) {
        const { data: tasks, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('completed', false)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (!tasks?.length) {
          return {
            type: 'text',
            message: "No pending tasks found."
          };
        }

        const tasksList = tasks
          .map(task => `📋 ${task.title}${task.due_date ? ` (Due: ${format(new Date(task.due_date), 'dd MMM yyyy')})` : ''}`)
          .join('\n');

        return {
          type: 'text',
          message: `Your Pending Tasks:\n\n${tasksList}`
        };
      }

      // Default response
      return {
        type: 'text',
        message: "I can help you with managing events and tasks. Try asking about upcoming events or your to-do list!"
      };
    }

    return {
      type: 'text',
      message: "I'm not sure how to handle that type of message. Please try typing your question."
    };
  } catch (error) {
    console.error('Error handling message:', error);
    throw error;
  }
};
