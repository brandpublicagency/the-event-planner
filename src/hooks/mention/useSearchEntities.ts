
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MentionItem } from '@/components/documents/MentionSelector';

/**
 * Hook responsible for searching entities (tasks, events, documents, users)
 * for mention suggestions
 */
export function useSearchEntities() {
  const [isSearching, setIsSearching] = useState(false);
  
  // Search all entity types at once when query changes
  const searchAllEntities = useCallback(async (query: string) => {
    try {
      // If query is too short, return early with empty results
      if (!query || query.length === 0) {
        return [];
      }
      
      console.log('Searching entities for:', query);
      setIsSearching(true);
      
      // Default empty results
      let taskResults: MentionItem[] = [];
      let eventResults: MentionItem[] = [];
      let documentResults: MentionItem[] = [];
      let userResults: MentionItem[] = [];

      // Execute search queries in parallel
      const [taskResponse, eventResponse, documentResponse, userResponse] = await Promise.all([
        // Search tasks
        supabase
          .from('tasks')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(5),
        
        // Search events
        supabase
          .from('events')
          .select('event_code, name')
          .ilike('name', `%${query}%`)
          .limit(5),
        
        // Search documents
        supabase
          .from('documents')
          .select('id, title')
          .ilike('title', `%${query}%`)
          .limit(5),
        
        // Search users
        supabase
          .from('profiles')
          .select('id, full_name')
          .ilike('full_name', `%${query}%`)
          .limit(5)
      ]);
      
      // Format and check each result set separately to prevent errors
      if (taskResponse.data && !taskResponse.error) {
        taskResults = taskResponse.data.map(task => ({
          id: task.id,
          label: task.title,
          type: 'task' as const
        }));
      } else if (taskResponse.error) {
        console.error('Error fetching tasks:', taskResponse.error);
      }
      
      if (eventResponse.data && !eventResponse.error) {
        eventResults = eventResponse.data.map(event => ({
          id: event.event_code,
          label: event.name,
          type: 'event' as const
        }));
      } else if (eventResponse.error) {
        console.error('Error fetching events:', eventResponse.error);
      }
      
      if (documentResponse.data && !documentResponse.error) {
        documentResults = documentResponse.data.map(doc => ({
          id: doc.id,
          label: doc.title,
          type: 'document' as const
        }));
      } else if (documentResponse.error) {
        console.error('Error fetching documents:', documentResponse.error);
      }
      
      if (userResponse.data && !userResponse.error) {
        userResults = userResponse.data.map(user => ({
          id: user.id,
          label: user.full_name,
          type: 'user' as const
        }));
      } else if (userResponse.error) {
        console.error('Error fetching users:', userResponse.error);
      }
      
      // Combine all results
      const combinedResults = [
        ...taskResults,
        ...eventResults,
        ...documentResults,
        ...userResults
      ];
      
      console.log('Search results:', combinedResults.length);
      return combinedResults;
    } catch (error) {
      console.error('Error searching entities:', error);
      return []; // Return empty array on error instead of throwing
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { searchAllEntities, isSearching };
}
