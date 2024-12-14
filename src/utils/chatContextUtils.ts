// Split into smaller files for better maintainability
import type { Event } from "@/types/event";
import { format, isFuture, parseISO, compareAsc } from "date-fns";
import { formatEventDetails } from "./formatEventDetails";
import { formatMenuDetails } from "./formatMenuDetails";
import { formatClientDetails } from "./formatClientDetails";

export const prepareEventsContext = (events: Event[] = []) => {
  // Sort events by date and filter out past events
  const sortedFutureEvents = events
    .filter(event => event.event_date && isFuture(parseISO(event.event_date)))
    .sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return compareAsc(parseISO(a.event_date), parseISO(b.event_date));
    });

  const pastEvents = events
    .filter(event => event.event_date && !isFuture(parseISO(event.event_date)))
    .sort((a, b) => {
      if (!a.event_date || !b.event_date) return 0;
      return compareAsc(parseISO(b.event_date), parseISO(a.event_date));
    });

  const eventsContext = sortedFutureEvents.map(formatEventDetails).join('\n\n');
  const pastEventsContext = pastEvents.length > 0 
    ? `\n\nPast Events:\n${pastEvents.map(formatEventDetails).join('\n\n')}`
    : '';

  return `Current and Upcoming Events:\n${eventsContext}${pastEventsContext}`;
};

export const getSystemMessage = (eventsContext: string, pdfContext: string) => {
  return {
    role: "system" as const,
    content: `You are an expert event planning assistant with access to event information. Your primary role is to provide accurate and helpful information about events, their details, and answer specific questions about them.

Available Event Information:
${eventsContext || 'No events found.'}

Document Knowledge Base:
${pdfContext || 'No documents available.'}

When answering questions:
1. If asked about a specific event or person, search through the events data and provide precise information
2. For wedding events, include the couple's names and date
3. For corporate events, include the company name and event type
4. Always mention the venue and time if available
5. If you can't find specific information, clearly state that

Remember to:
- Be direct and specific in your answers
- Include relevant dates, times, and venues
- If you're not sure about something, say so
- If the information isn't available, explain what's missing

You can perform actions by responding with specific JSON formats for updates, but primarily focus on providing accurate information from the available data.`
  };
};