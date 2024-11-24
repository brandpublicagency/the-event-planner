import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

export const handleEventQuestion = async (question: string) => {
  try {
    // Fetch all non-deleted events with their complete details
    const { data: events } = await supabase
      .from('events')
      .select(`
        *,
        wedding_details (*),
        corporate_details (*),
        menu_selections (*),
        event_venues (
          venues (
            name
          )
        ),
        tasks (
          id,
          title,
          completed,
          due_date,
          priority,
          status
        )
      `)
      .is('deleted_at', null);

    if (!events?.length) {
      return {
        type: 'text',
        message: "I couldn't find any events to answer questions about."
      };
    }

    // Prepare context about all events and their related data
    const eventsContext = events.map(event => {
      const venues = event.event_venues?.map(v => v.venues?.name).filter(Boolean).join(', ') || 'No venue specified';
      const date = event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Date not set';
      
      let clientDetails = '';
      if (event.wedding_details) {
        clientDetails = `Wedding of ${event.wedding_details.bride_name} & ${event.wedding_details.groom_name}`;
      } else if (event.corporate_details) {
        clientDetails = `Corporate event for ${event.corporate_details.company_name}`;
      }

      const tasks = event.tasks || [];
      const tasksInfo = tasks.length > 0 
        ? `\nRelated Tasks:\n${tasks.map(task => 
          `- ${task.title} (${task.status})`).join('\n')}`
        : '\nNo related tasks';

      const menuInfo = event.menu_selections 
        ? `\nMenu Type: ${event.menu_selections.starter_type || 'Not specified'}
           Main Course: ${event.menu_selections.main_course_type || 'Not specified'}
           Dessert: ${event.menu_selections.dessert_type || 'Not specified'}`
        : '\nNo menu selected';

      return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Venue: ${venues}
Details: ${clientDetails}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}
${menuInfo}
${tasksInfo}`;
    }).join('\n\n');

    // Get AI to interpret the question and provide an answer
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful event planning assistant. You have access to information about the following events:

${eventsContext}

Answer questions about these events naturally and conversationally. You can provide information about:
- Event details and schedules
- Menu selections and catering details
- Task status and deadlines
- Venue information
- Client details

If you're not sure about something, say so. If the question is about an event that doesn't exist, let them know. Keep responses concise but informative.`
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";

    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling event question:', error);
    return {
      type: 'text',
      message: "I'm sorry, I encountered an error while trying to answer your question. Please try again later."
    };
  }
};