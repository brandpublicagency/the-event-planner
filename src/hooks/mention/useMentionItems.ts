
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

/**
 * Hook to fetch mention items based on a query
 */
export function useMentionItems(query: string | null) {
  const [items, setItems] = useState<MentionItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (query === null) {
      setItems([]);
      setLoading(false);
      return;
    }
    
    // Set loading state immediately
    setLoading(true);
    
    // Use a flag to track if the component is still mounted
    let isMounted = true;
    
    const fetchItems = async () => {
      try {
        // Always fetch some results even with empty query for "/" activation
        const searchTerm = query.trim() || '';
        console.log(`Fetching items for query:`, searchTerm);
        
        let allItems: MentionItem[] = [];
        
        // Fetch events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('event_code, name')
          .ilike('name', `%${searchTerm}%`)
          .is('deleted_at', null)
          .limit(5);
          
        if (eventsError) console.error('Error fetching events:', eventsError);
        
        const eventItems = events?.map(event => ({
          id: event.event_code,
          label: event.name,
          type: 'event' as const
        })) || [];
        
        // Fetch tasks
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${searchTerm}%`)
          .limit(5);
          
        if (tasksError) console.error('Error fetching tasks:', tasksError);
        
        const taskItems = tasks?.map(task => ({
          id: task.id,
          label: task.title,
          type: 'task' as const
        })) || [];
        
        // Fetch documents
        const { data: documents, error: documentsError } = await supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${searchTerm}%`)
          .is('deleted_at', null)
          .limit(5);
          
        if (documentsError) console.error('Error fetching documents:', documentsError);
        
        const documentItems = documents?.map(doc => ({
          id: doc.id,
          label: doc.title,
          type: 'document' as const
        })) || [];
        
        // Fetch users
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .ilike('full_name', `%${searchTerm}%`)
          .limit(5);
          
        if (usersError) console.error('Error fetching users:', usersError);
        
        const userItems = users?.map(user => ({
          id: user.id,
          label: user.full_name,
          type: 'user' as const
        })) || [];
        
        // Combine all items
        allItems = [...eventItems, ...taskItems, ...documentItems, ...userItems];
        
        // Check if the component is still mounted before updating state
        if (isMounted) {
          console.log(`Fetched items:`, allItems.length);
          setItems(allItems);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error fetching items:`, error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Fetch immediately for better responsiveness
    fetchItems();
    
    return () => {
      isMounted = false;
    };
  }, [query]);
  
  return { items, loading };
}
