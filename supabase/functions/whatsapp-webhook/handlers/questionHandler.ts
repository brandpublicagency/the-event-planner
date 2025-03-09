
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
    
    // Fetch events with timeout - enhanced query with better join structure
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

    // Split events into upcoming and past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const upcomingEvents = events?.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate >= currentDate;
    }) || [];
    
    const pastEvents = events?.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate < currentDate;
    }) || [];
    
    // Format events context
    let eventsContext = '';
    
    if (upcomingEvents.length > 0) {
      eventsContext += "UPCOMING EVENTS:\n";
      eventsContext += upcomingEvents.map(event => {
        const venues = event.event_venues
          ?.map((v: any) => v.venues?.name)
          .filter(Boolean)
          .join(', ') || 'No venue specified';
        
        const date = event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Date not set';
        
        let clientDetails = '';
        if (event.wedding_details) {
          clientDetails = `Wedding of ${event.wedding_details.bride_name || 'Bride'} & ${event.wedding_details.groom_name || 'Groom'}`;
        } else if (event.corporate_details) {
          clientDetails = `Corporate event for ${event.corporate_details.company_name || 'Company'}`;
        }

        const menuInfo = event.menu_selections 
          ? `Menu: ${event.menu_selections.is_custom ? 'Custom Menu' : 'Standard Menu'}, ` + 
            `Starter: ${event.menu_selections.starter_type || 'Not selected'}, ` +
            `Main: ${event.menu_selections.main_course_type || 'Not selected'}, ` +
            `Dessert: ${event.menu_selections.dessert_type || 'Not selected'}`
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
      }).join('\n\n');
    } else {
      eventsContext += "No upcoming events found.\n";
    }
    
    if (pastEvents.length > 0) {
      eventsContext += "\n\nPAST EVENTS (Limited Info):\n";
      eventsContext += pastEvents.slice(0, 5).map(event => {
        return `Event: ${event.name} (${event.event_code}), Date: ${event.event_date ? format(new Date(event.event_date), 'dd/MM/yyyy') : 'Not set'}, Type: ${event.event_type}`;
      }).join('\n');
      
      if (pastEvents.length > 5) {
        eventsContext += `\n...and ${pastEvents.length - 5} more past events`;
      }
    }

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
Created: ${doc.created_at ? format(new Date(doc.created_at), 'dd/MM/yyyy') : 'Unknown date'}
Categories: ${doc.document_categories?.map((cat: any) => cat.name).join(', ') || 'None'}`;
    }).join('\n\n') || 'No documents found.';

    // Format tasks context - split into overdue, today, and upcoming
    let tasksContext = '';
    if (tasks && tasks.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const overdueTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate < today && !task.completed;
      });
      
      const todayTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate < tomorrow && !task.completed;
      });
      
      const upcomingTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= tomorrow && !task.completed;
      });
      
      if (overdueTasks.length > 0) {
        tasksContext += "OVERDUE TASKS:\n";
        tasksContext += overdueTasks.map(task => `- ${task.title} (${task.status.toUpperCase()}, Due: ${format(new Date(task.due_date!), 'dd/MM/yyyy')})`).join('\n');
      }
      
      if (todayTasks.length > 0) {
        if (tasksContext) tasksContext += '\n\n';
        tasksContext += "TODAY'S TASKS:\n";
        tasksContext += todayTasks.map(task => `- ${task.title} (${task.status.toUpperCase()})`).join('\n');
      }
      
      if (upcomingTasks.length > 0) {
        if (tasksContext) tasksContext += '\n\n';
        tasksContext += "UPCOMING TASKS:\n";
        tasksContext += upcomingTasks.map(task => `- ${task.title} (${task.status.toUpperCase()}, Due: ${format(new Date(task.due_date!), 'dd/MM/yyyy')})`).join('\n');
      }
    } else {
      tasksContext = "No tasks found.";
    }

    // Use GPT model with complete context
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for Warm Karoo, an event planning company. You have FULL ACCESS to all events, tasks, contacts, and documents data. Answer questions with information from this context:

EVENTS:
${eventsContext}

CONTACTS:
${contactsContext}

DOCUMENTS:
${documentsContext}

TASKS:
${tasksContext}

Current date: ${format(new Date(), 'dd/MM/yyyy')}

IMPORTANT INSTRUCTIONS:
1. When asked about events or tasks, ALWAYS check the provided data and give clear answers.
2. Use the format DD/MM/YYYY for dates.
3. For the "next event" question, check the UPCOMING EVENTS section and provide details about the first event.
4. If asked to create, update or delete anything, explain how this can be done through the system.
5. Always maintain a professional, helpful tone representing Warm Karoo.
6. If you don't know something or the data doesn't contain the answer, be honest and say so.`
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 800,
        temperature: 0.5
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
