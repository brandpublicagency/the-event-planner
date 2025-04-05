
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
    if (q === null) {
      console.log('No query provided for mention items');
      return [];
    }
    
    // For empty queries (right after typing '/'), return a basic set of items
    if (q === '') {
      console.log('Empty query, returning default mention items');
      return [
        { id: 'document_example', label: 'Documents', type: 'document' },
        { id: 'task_example', label: 'Tasks', type: 'task' },
        { id: 'event_example', label: 'Events', type: 'event' },
        { id: 'user_example', label: 'Users', type: 'user' },
      ];
    }
    
    const lowerQuery = q.toLowerCase();
    console.log('Fetching mention items for query:', lowerQuery);
    
    const items: MentionItem[] = [];
    
    try {
      // Fetch documents
      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('id, title')
        .ilike('title', `%${lowerQuery}%`)
        .is('deleted_at', null)
        .limit(5);
      
      if (docError) {
        console.error('Error fetching document mention items:', docError);
      }
      
      if (documents) {
        console.log('Found document mentions:', documents.length);
        documents.forEach(doc => {
          items.push({
            id: doc.id,
            label: doc.title || 'Untitled Document',
            type: 'document'
          });
        });
      }
      
      // Fetch tasks
      const { data: tasks, error: taskError } = await supabase
        .from('tasks')
        .select('id, title')
        .ilike('title', `%${lowerQuery}%`)
        .limit(5);
      
      if (taskError) {
        console.error('Error fetching task mention items:', taskError);
      }
      
      if (tasks) {
        console.log('Found task mentions:', tasks.length);
        tasks.forEach(task => {
          items.push({
            id: task.id,
            label: task.title,
            type: 'task'
          });
        });
      }
      
      // Fetch events - using correct column names (event_code and name)
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('event_code, name')
        .ilike('name', `%${lowerQuery}%`)
        .limit(5);
      
      if (eventError) {
        console.error('Error fetching event mention items:', eventError);
      }
      
      if (events) {
        console.log('Found event mentions:', events.length);
        events.forEach(event => {
          items.push({
            id: event.event_code,
            label: event.name,
            type: 'event'
          });
        });
      }
      
      // Fetch users
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', `%${lowerQuery}%`)
        .limit(5);
      
      if (userError) {
        console.error('Error fetching user mention items:', userError);
      }
      
      if (users) {
        console.log('Found user mentions:', users.length);
        users.forEach(user => {
          items.push({
            id: user.id,
            label: user.full_name || 'Unknown User',
            type: 'user'
          });
        });
      }
      
      console.log('Total mention items found:', items.length);
      return items;
    } catch (error) {
      console.error('Unexpected error in fetchMentionItems:', error);
      return [];
    }
  };
  
  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['mentionItems', query],
    queryFn: () => fetchMentionItems(query),
    enabled: query !== null,
    staleTime: 30000, // Cache results for 30 seconds
  });
  
  if (error) {
    console.error('Error in useMentionItems query:', error);
  }
  
  return {
    items,
    isLoading
  };
}
