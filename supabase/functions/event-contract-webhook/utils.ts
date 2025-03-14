
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate a unique event code based on event type
 */
export const generateEventCode = async (eventType: string) => {
  // Use first 3 letters of event type
  const prefix = eventType.substring(0, 3).toUpperCase();
  const date = new Date();
  // Format: [Event Type Prefix]-[YY][MM]-[Random 3 digits]
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  const baseCode = `${prefix}-${year}${month}-${random}`;
  
  try {
    // Check if code already exists and generate a unique one if needed
    const { data: existingEvent } = await supabase
      .from('events')
      .select('event_code')
      .eq('event_code', baseCode)
      .single();
    
    if (existingEvent) {
      // Try again with a different random number
      return generateEventCode(eventType);
    }
    
    return baseCode;
  } catch (error) {
    // If error is because record not found, code is unique
    return baseCode;
  }
};
