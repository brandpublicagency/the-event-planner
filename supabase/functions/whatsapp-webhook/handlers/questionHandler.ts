import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

// Set a timeout of 15 seconds
const TIMEOUT = 15000;

export const handleAIQuestion = async (question: string) => {
  try {
    console.log('Processing AI question:', question);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), TIMEOUT);
    });

    // Fetch events with a timeout
    const eventsPromise = supabase
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
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true });

    const { data: events, error } = await Promise.race([eventsPromise, timeoutPromise]) as any;

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    const eventsContext = events?.map(event => {
      const venues = event.event_venues
        ?.map((v: any) => v.venues?.name)
        .filter(Boolean)
        .join(', ') || 'No venue specified';
      
      const date = event.event_date ? format(new Date(event.event_date), 'MMMM d, yyyy') : 'Date not set';
      
      let clientDetails = '';
      if (event.wedding_details) {
        clientDetails = `Wedding of ${event.wedding_details.bride_name || 'Bride'} & ${event.wedding_details.groom_name || 'Groom'}`;
      } else if (event.corporate_details) {
        clientDetails = `Corporate event for ${event.corporate_details.company_name || 'Company'}`;
      }

      const menuInfo = event.menu_selections 
        ? `Menu: ${event.menu_selections.is_custom ? 'Custom Menu' : 'Standard Menu'}`
        : 'No menu selected';

      return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
Venue: ${venues}
Details: ${clientDetails}
${menuInfo}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}`;
    }).join('\n\n') || 'No upcoming events found.';

    // Use GPT-3.5-turbo instead of GPT-4 for faster responses
    const completionPromise = openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful event planning assistant. Answer questions about these events:

${eventsContext}

Answer naturally and conversationally. Keep responses concise but informative.
If you're not sure about something, say so.
If asked about an event that doesn't exist, let them know.
Always maintain a professional and helpful tone.`
        },
        {
          role: "user",
          content: question
        }
      ],
      max_tokens: 300, // Limit response length
      temperature: 0.7
    });

    const completion = await Promise.race([completionPromise, timeoutPromise]) as any;
    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
    console.log('Generated AI response:', answer);

    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling AI question:', error);
    if (error.message === 'Request timed out') {
      return {
        type: 'text',
        message: "I apologize, but the request took too long to process. Please try asking a simpler question or try again later."
      };
    }
    return {
      type: 'text',
      message: "I'm sorry, I encountered an error while trying to answer your question. Please try again later."
    };
  }
};