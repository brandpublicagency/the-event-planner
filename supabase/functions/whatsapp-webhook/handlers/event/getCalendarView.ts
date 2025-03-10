
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { format } from "https://deno.land/std@0.190.0/datetime/mod.ts";
import { WhatsAppResponse } from '../../utils/timeoutUtils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getCalendarView = async (): Promise<WhatsAppResponse> => {
  console.log('Generating calendar view');
  
  try {
    const today = new Date();
    const inOneMonth = new Date(today);
    inOneMonth.setMonth(today.getMonth() + 1);
    
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today.toISOString())
      .lt('event_date', inOneMonth.toISOString())
      .is('deleted_at', null)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }

    if (!events?.length) {
      return {
        type: 'text',
        message: "No events found in the next 30 days."
      };
    }

    // Group events by week
    const eventsByWeek: Record<string, any[]> = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.event_date);
      const weekStart = new Date(eventDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Start from Monday
      
      const weekKey = format(weekStart, "d MMM") + " - " + 
                     format(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), "d MMM");
      
      if (!eventsByWeek[weekKey]) {
        eventsByWeek[weekKey] = [];
      }
      
      eventsByWeek[weekKey].push(event);
    });

    // Format the calendar output
    let calendarText = "*Calendar: Next 30 Days*\n\n";
    
    Object.entries(eventsByWeek).forEach(([week, weekEvents]) => {
      calendarText += `*Week: ${week}*\n`;
      
      weekEvents.forEach(event => {
        const eventDate = new Date(event.event_date);
        calendarText += `• ${format(eventDate, "EEE, d MMM")}: ${event.name} (${event.event_type})\n`;
      });
      
      calendarText += "\n";
    });

    return {
      type: 'text',
      message: calendarText
    };
  } catch (error) {
    console.error('Error in getCalendarView:', error);
    return {
      type: 'text',
      message: "I encountered an error while generating the calendar view. Please try again later."
    };
  }
};
