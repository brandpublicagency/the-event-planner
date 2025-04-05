
import { JsonMention } from '@/integrations/supabase/types/json';
import { supabase } from "@/integrations/supabase/client";
import { mentionsToJson, jsonToMentions } from '@/integrations/supabase/types/json';

// Utility to extract mentions from HTML content
export const extractMentions = (content: string): JsonMention[] => {
  const mentionRegex = /<span[^>]*data-mention[^>]*data-id="([^"]*)"[^>]*data-type="([^"]*)"[^>]*>/g;
  const mentions: JsonMention[] = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      id: match[1],
      type: match[2] as 'document' | 'task' | 'event' | 'user'
    });
  }
  
  return mentions;
};

// Update mentions tracking in database
export const updateMentions = async (documentId: string, mentions: JsonMention[]) => {
  if (!documentId || !mentions.length) return;
  
  try {
    // First, update the current document's mentions list
    await supabase
      .from('documents')
      .update({ 
        mentions: mentionsToJson(mentions)
      })
      .eq('id', documentId);
    
    // Then, update mentioned_in for each referenced item
    for (const mention of mentions) {
      const { id, type } = mention;
      
      // Construct the reference to this document
      const mentionedInRef: JsonMention = {
        id: documentId,
        type: 'document'
      };
      
      // Update the appropriate table based on the mention type
      if (type === 'document') {
        // Get the document to check if it already has the mention
        const { data: targetDoc } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();
        
        if (targetDoc) {
          // Parse the mentioned_in array and check if this document is already there
          const mentionedIn = jsonToMentions(targetDoc.mentioned_in);
          const alreadyMentioned = mentionedIn.some(
            (m: JsonMention) => m.id === documentId && m.type === 'document'
          );
          
          if (!alreadyMentioned) {
            // Add this document to the mentioned_in array and convert back to Json
            await supabase
              .from('documents')
              .update({
                mentioned_in: mentionsToJson([...mentionedIn, mentionedInRef])
              })
              .eq('id', id);
          }
        }
      } else if (type === 'task') {
        // Similar logic for tasks
        const { data: targetTask } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();
        
        if (targetTask) {
          const mentionedIn = jsonToMentions(targetTask.mentioned_in);
          const alreadyMentioned = mentionedIn.some(
            (m: JsonMention) => m.id === documentId && m.type === 'document'
          );
          
          if (!alreadyMentioned) {
            await supabase
              .from('tasks')
              .update({
                mentioned_in: mentionsToJson([...mentionedIn, mentionedInRef])
              })
              .eq('id', id);
          }
        }
      } else if (type === 'event') {
        // Similar logic for events
        const { data: targetEvent } = await supabase
          .from('events')
          .select('*')
          .eq('event_code', id)
          .single();
        
        if (targetEvent) {
          const mentionedIn = jsonToMentions(targetEvent.mentioned_in);
          const alreadyMentioned = mentionedIn.some(
            (m: JsonMention) => m.id === documentId && m.type === 'document'
          );
          
          if (!alreadyMentioned) {
            await supabase
              .from('events')
              .update({
                mentioned_in: mentionsToJson([...mentionedIn, mentionedInRef])
              })
              .eq('event_code', id);
          }
        }
      } 
      // Handle user mentions (we don't track mentioned_in for users currently)
    }
  } catch (error) {
    console.error('Error updating mentions:', error);
  }
};
