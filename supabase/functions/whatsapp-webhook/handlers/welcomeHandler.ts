
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

export const getWelcomeMessage = async () => {
  return {
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'Welcome! How can I help you today?'
      },
      body: {
        text: 'Please select an option:'
      },
      action: {
        button: 'View Options',
        sections: [{
          title: 'Event Management',
          rows: [
            { id: 'upcoming_events', title: 'View Upcoming Events' },
            { id: 'event_menus', title: 'View Event Menus' },
            { id: 'tasks', title: 'View Tasks' },
            { id: 'calendar', title: 'View Calendar' }
          ]
        }]
      }
    }
  };
};

export const getHelpMessage = () => {
  return {
    type: 'text',
    message: `*Available Commands*
• Send 'hi' or 'hello' to see main menu
• Send 'events' to view upcoming events
• Send 'menu' to view event menus
• Send 'tasks' to view recent tasks
• Send 'calendar' to view upcoming calendar
• Ask any question about events or tasks
• Send 'help' to see this message again`
  };
};
