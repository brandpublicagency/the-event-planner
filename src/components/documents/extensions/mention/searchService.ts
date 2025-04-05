
import { supabase } from '@/integrations/supabase/client';
import { MentionResult } from './types';
import { groupItems } from './utils';

export const searchMentionItems = async (searchQuery: string) => {
  if (searchQuery.length < 2) {
    return [];
  }

  try {
    // Search for documents
    const { data: documents } = await supabase
      .from('documents')
      .select('id, title')
      .ilike('title', `%${searchQuery}%`)
      .is('deleted_at', null)
      .limit(5);

    // Search for tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id, title')
      .ilike('title', `%${searchQuery}%`)
      .is('deleted_at', null)
      .limit(5);

    // Search for events
    const { data: events } = await supabase
      .from('events')
      .select('event_code, name')
      .ilike('name', `%${searchQuery}%`)
      .is('deleted_at', null)
      .limit(5);

    // Search for users
    const { data: users } = await supabase
      .from('profiles')
      .select('id, full_name')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(5);

    // Format results
    const results: MentionResult[] = [
      ...(documents?.map(doc => ({
        id: doc.id,
        title: doc.title || 'Untitled',
        type: 'document' as const,
        url: `/documents?selected=${doc.id}`,
      })) || []),
      ...(tasks?.map(task => ({
        id: task.id,
        title: task.title,
        type: 'task' as const,
        url: `/tasks?selected=${task.id}`,
      })) || []),
      ...(events?.map(event => ({
        id: event.event_code,
        title: event.name,
        type: 'event' as const,
        url: `/events/${event.event_code}`,
      })) || []),
      ...(users?.map(user => ({
        id: user.id,
        title: user.full_name,
        type: 'user' as const,
        url: `/profile/${user.id}`,
      })) || []),
    ];

    // Group and organize the results
    return groupItems(results);
  } catch (error) {
    console.error('Error fetching mention suggestions:', error);
    return [];
  }
};
