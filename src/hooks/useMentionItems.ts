
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

export type MentionCategory = 'event' | 'task' | 'document' | 'user' | null;

export function useMentionItems(query: string | null, category: MentionCategory = null) {
  const [items, setItems] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // If no query or just the slash, and no category selected, return category options
  useEffect(() => {
    if (query === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    
    if (category === null) {
      // If we're at the category selection stage, show category options
      // regardless of query (even if it's just "/")
      setItems([
        { id: 'category-user', label: 'User', type: 'user' },
        { id: 'category-event', label: 'Event', type: 'event' },
        { id: 'category-task', label: 'Task', type: 'task' },
        { id: 'category-document', label: 'Document', type: 'document' },
      ]);
      setLoading(false);
      return;
    }
    
    // Set loading state immediately
    setLoading(true);
    
    // Use a flag to track if the component is still mounted
    let isMounted = true;
    
    const fetchItems = async () => {
      try {
        console.log(`Fetching ${category} items for query:`, query);
        
        let mentionItems: MentionItem[] = [];
        
        // Fetch items based on the selected category
        if (category === 'event') {
          const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('event_code, name')
            .ilike('name', `%${query || ''}%`)
            .is('deleted_at', null)
            .limit(10);
            
          if (eventsError) console.error('Error fetching events:', eventsError);
          
          mentionItems = events?.map(event => ({
            id: event.event_code,
            label: event.name,
            type: 'event' as const
          })) || [];
        } 
        else if (category === 'task') {
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('id, title')
            .ilike('title', `%${query || ''}%`)
            .limit(10);
            
          if (tasksError) console.error('Error fetching tasks:', tasksError);
          
          mentionItems = tasks?.map(task => ({
            id: task.id,
            label: task.title,
            type: 'task' as const
          })) || [];
        } 
        else if (category === 'document') {
          const { data: documents, error: documentsError } = await supabase
            .from('documents')
            .select('id, title')
            .ilike('title', `%${query || ''}%`)
            .is('deleted_at', null)
            .limit(10);
            
          if (documentsError) console.error('Error fetching documents:', documentsError);
          
          mentionItems = documents?.map(doc => ({
            id: doc.id,
            label: doc.title,
            type: 'document' as const
          })) || [];
        }
        else if (category === 'user') {
          const { data: users, error: usersError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .ilike('full_name', `%${query || ''}%`)
            .limit(10);
            
          if (usersError) console.error('Error fetching users:', usersError);
          
          mentionItems = users?.map(user => ({
            id: user.id,
            label: user.full_name,
            type: 'user' as const
          })) || [];
        }
        
        // Check if the component is still mounted before updating state
        if (isMounted) {
          console.log(`Fetched ${category} items:`, mentionItems.length);
          setItems(mentionItems);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching ${category} items:`, error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Delay fetch slightly to avoid excessive database calls while typing
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query, category]);
  
  return { items, loading };
}
