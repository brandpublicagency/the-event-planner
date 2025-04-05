
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document';
}

export function useMentionItems(query: string | null) {
  const [items, setItems] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (query === null) {
      setItems([]);
      return;
    }
    
    const fetchItems = async () => {
      setLoading(true);
      
      try {
        // Fetch events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('event_code, name')
          .ilike('name', `%${query}%`)
          .is('deleted_at', null)
          .limit(5);
          
        if (eventsError) console.error('Error fetching events:', eventsError);
        
        // Fetch tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(5);
          
        if (tasksError) console.error('Error fetching tasks:', tasksError);
        
        // Fetch documents
        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .is('deleted_at', null)
          .limit(5);
          
        if (documentsError) console.error('Error fetching documents:', documentsError);
        
        // Combine and transform results
        const mentionItems: MentionItem[] = [
          ...(events?.map(event => ({
            id: event.event_code,
            label: event.name,
            type: 'event' as const
          })) || []),
          
          ...(tasks?.map(task => ({
            id: task.id,
            label: task.title,
            type: 'task' as const
          })) || []),
          
          ...(documents?.map(doc => ({
            id: doc.id,
            label: doc.title,
            type: 'document' as const
          })) || [])
        ];
        
        setItems(mentionItems);
      } catch (error) {
        console.error('Error fetching mention items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [query]);
  
  return { items, loading };
}
