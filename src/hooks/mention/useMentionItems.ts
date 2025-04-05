
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
        const searchTerm = query.trim();
        
        // Only fetch 3 items of each type to optimize performance
        const fetchLimit = 3;
        const promises = [
          // Fetch events
          supabase
            .from('events')
            .select('event_code, name')
            .ilike('name', `%${searchTerm}%`)
            .is('deleted_at', null)
            .limit(fetchLimit),
            
          // Fetch tasks
          supabase
            .from('tasks')
            .select('id, title')
            .ilike('title', `%${searchTerm}%`)
            .limit(fetchLimit),
            
          // Fetch documents
          supabase
            .from('documents')
            .select('id, title')
            .ilike('title', `%${searchTerm}%`)
            .is('deleted_at', null)
            .limit(fetchLimit),
            
          // Fetch users
          supabase
            .from('profiles')
            .select('id, full_name')
            .ilike('full_name', `%${searchTerm}%`)
            .limit(fetchLimit)
        ];
        
        const [eventsResult, tasksResult, documentsResult, usersResult] = await Promise.all(promises);
        
        // Handle errors
        if (eventsResult.error) console.error('Error fetching events:', eventsResult.error);
        if (tasksResult.error) console.error('Error fetching tasks:', tasksResult.error);
        if (documentsResult.error) console.error('Error fetching documents:', documentsResult.error);
        if (usersResult.error) console.error('Error fetching users:', usersResult.error);
        
        // Map results to MentionItem format
        const eventItems = (eventsResult.data || []).map(event => ({
          id: event.event_code,
          label: event.name,
          type: 'event' as const
        }));
        
        const taskItems = (tasksResult.data || []).map(task => ({
          id: task.id,
          label: task.title,
          type: 'task' as const
        }));
        
        const documentItems = (documentsResult.data || []).map(doc => ({
          id: doc.id,
          label: doc.title,
          type: 'document' as const
        }));
        
        const userItems = (usersResult.data || []).map(user => ({
          id: user.id,
          label: user.full_name,
          type: 'user' as const
        }));
        
        // Combine all items
        const allItems = [...eventItems, ...taskItems, ...documentItems, ...userItems];
        
        // Check if the component is still mounted before updating state
        if (isMounted) {
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
    
    // Use a short debounce to avoid too many requests
    const timeoutId = setTimeout(fetchItems, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [query]);
  
  return { items, loading };
}
