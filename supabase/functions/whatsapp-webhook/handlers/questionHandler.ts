import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')!
});

export const handleAIQuestion = async (question: string) => {
  try {
    console.log('Processing AI question:', question);
    
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error } = await supabase
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
        )
      `)
      .gte('event_date', today)
      .is('deleted_at', null)
      .is('completed', false)
      .order('event_date', { ascending: true });

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

      return `Event: ${event.name}
Type: ${event.event_type}
Date: ${date}
Time: ${event.start_time || 'Not set'}${event.end_time ? ` - ${event.end_time}` : ''}
Venue: ${venues}
Details: ${clientDetails}
Pax: ${event.pax || 'Not specified'}
Event Code: ${event.event_code}`;
    }).join('\n\n') || 'No upcoming events found.';

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a helpful event planning assistant. Answer questions about these events:

${eventsContext}

Answer naturally and conversationally. Keep responses concise but informative.`
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
    console.log('Generated AI response:', answer);

    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling AI question:', error);
    return {
      type: 'text',
      message: "I'm sorry, I encountered an error while trying to answer your question. Please try again later."
    };
  }
};