
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MentionItem {
  id: string;
  label: string;
  type: 'event' | 'task' | 'document' | 'user';
}

/**
 * Hook to fetch mention items based on query
 */
export function useMentionItems(query: string | null) {
  const fetchMentionItems = async (q: string | null) => {
    if (!q) return [];
    
    const lowerQuery = q.toLowerCase();
    const items: MentionItem[] = [];
    
    // Fetch documents
    const { data: documents } = await supabase
      .from('documents')
      .select('id, title')
      .ilike('title', `%${lowerQuery}%`)
      .is('deleted_at', null)
      .limit(5);
    
    if (documents) {
      documents.forEach(doc => {
        items.push({
          id: doc.id,
          label: doc.title || 'Untitled Document',
          type: 'document'
        });
      });
    }
    
    // Fetch tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title')
      .ilike('title', `%${lowerQuery}%`)
      .limit(5);
    
    if (tasks) {
      tasks.forEach(task => {
        items.push({
          id: task.id,
          label: task.title,
          type: 'task'
        });
      });
    }
    
    // Fetch events
    const { data: events } = await supabase
      .from('events')
      .select('event_code, title')
      .ilike('title', `%${lowerQuery}%`)
      .limit(5);
    
    if (events) {
      events.forEach(event => {
        items.push({
          id: event.event_code,
          label: event.title,
          type: 'event'
        });
      });
    }
    
    // Fetch users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name')
      .ilike('full_name', `%${lowerQuery}%`)
      .limit(5);
    
    if (users) {
      users.forEach(user => {
        items.push({
          id: user.id,
          label: user.full_name || 'Unknown User',
          type: 'user'
        });
      });
    }
    
    return items;
  };
  
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['mentionItems', query],
    queryFn: () => fetchMentionItems(query),
    enabled: !!query,
    staleTime: 30000, // Cache results for 30 seconds
  });
  
  if (error) {
    console.error('Error fetching mention items:', error);
  }
  
  return {
    items,
    isLoading
  };
}
