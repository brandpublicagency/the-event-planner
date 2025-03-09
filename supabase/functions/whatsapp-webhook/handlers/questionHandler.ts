
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import OpenAI from "https://esm.sh/openai@4.28.0";
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { withTimeout, handleTimeoutError } from '../utils/timeoutUtils.ts';

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
    
    // Fetch events with timeout
    const eventsQuery = supabase
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
      .is('deleted_at', null)
      .order('event_date', { ascending: true });

    const { data: events, error: eventsError } = await withTimeout(
      eventsQuery,
      'Events query'
    );

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    // Fetch contacts data
    const { data: contacts, error: contactsError } = await withTimeout(
      supabase.from('profiles').select('*'),
      'Contacts query'
    );

    if (contactsError) {
      console.error('Error fetching contacts:', contactsError);
      throw contactsError;
    }

    // Fetch documents data
    const { data: documents, error: documentsError } = await withTimeout(
      supabase.from('documents').select('*, document_categories(*)').is('deleted_at', null),
      'Documents query'
    );

    if (documentsError) {
      console.error('Error fetching documents:', documentsError);
      throw documentsError;
    }

    // Fetch tasks data
    const { data: tasks, error: tasksError } = await withTimeout(
      supabase.from('tasks').select('*'),
      'Tasks query'
    );

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      throw tasksError;
    }

    // Format events context
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
    }).join('\n\n') || 'No events found.';

    // Format contacts context
    const contactsContext = contacts?.map(contact => {
      return `Contact: ${contact.full_name || 'Unknown Name'}
Email: ${contact.email || 'No email'}
Phone: ${contact.mobile || 'No phone'}`;
    }).join('\n\n') || 'No contacts found.';

    // Format documents context
    const documentsContext = documents?.map(doc => {
      return `Document: ${doc.title || 'Untitled'}
ID: ${doc.id}
Created: ${doc.created_at ? format(new Date(doc.created_at), 'MMMM d, yyyy') : 'Unknown date'}
Categories: ${doc.document_categories?.map((cat: any) => cat.name).join(', ') || 'None'}`;
    }).join('\n\n') || 'No documents found.';

    // Format tasks context
    const tasksContext = tasks?.map(task => {
      return `Task: ${task.title}
Status: ${task.status}
Priority: ${task.priority || 'None'}
Due Date: ${task.due_date ? format(new Date(task.due_date), 'MMMM d, yyyy') : 'No due date'}
${task.notes ? `Notes: ${task.notes.join(', ')}` : 'No notes'}`;
    }).join('\n\n') || 'No tasks found.';

    // Use GPT model with complete context
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for Warm Karoo, an event planning company. Answer questions with information from this context:

EVENTS:
${eventsContext}

CONTACTS:
${contactsContext}

DOCUMENTS:
${documentsContext}

TASKS:
${tasksContext}

Current date: ${format(new Date(), 'MMMM d, yyyy')}

You have full access to all data in the Warm Karoo system. Be professional, helpful and friendly.
If you don't have enough information to answer accurately, say so and suggest what the user can do instead.`
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      }),
      'AI completion'
    );

    const answer = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
    console.log('Generated AI response:', answer);

    return {
      type: 'text',
      message: answer
    };
  } catch (error) {
    console.error('Error handling AI question:', error);
    return handleTimeoutError(error);
  }
};
