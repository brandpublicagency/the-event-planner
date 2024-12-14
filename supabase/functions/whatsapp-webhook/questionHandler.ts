import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

export const handleEventQuestion = async (question: string) => {
  try {
    console.log('Processing question:', question);
    
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
      const date = event.event_date ? format(new Date(event.event_date), 'dd MMMM yyyy') : 'Date not set';
      
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

      return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Venue: ${venues}
Details: ${clientDetails}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}
${tasksInfo}`;
    }).join('\n\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful event planning assistant. Answer questions about these events:

${eventsContext}

Answer naturally and conversationally. You can provide information about:
- Event details and schedules
- Task status and deadlines
- Venue information
- Client details

If unsure, say so. If the question is about an event that doesn't exist, let them know.
Keep responses concise but informative.`
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