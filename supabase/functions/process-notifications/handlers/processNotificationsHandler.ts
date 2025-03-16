
import { createMissingNotifications } from './createMissingNotificationsHandler.ts';
import { cleanupDuplicateNotifications } from './cleanupDuplicatesHandler.ts';
import { processPendingNotifications } from './processPendingNotificationsHandler.ts';

/**
 * Main handler for processing notifications
 */
export async function handleProcessNotifications(supabase, options = {}) {
  console.log('Processing scheduled notifications...', options);

  // Step 1: Clean up any duplicate notifications
  await cleanupDuplicateNotifications(supabase);

  // Step 2: Fetch active notification triggers
  const { data: notificationTriggers, error: triggersError } = await supabase
    .from('notification_triggers')
    .select('*')
    .eq('enabled', true);
  
  if (triggersError) {
    console.error('Error fetching notification triggers:', triggersError);
    throw triggersError;
  }
  
  console.log(`Found ${notificationTriggers?.length || 0} active notification triggers`);

  // Step 3: Create any missing notifications for events
  const createdCount = await createMissingNotifications(supabase, notificationTriggers);

  // Step 4: Process pending notifications (ready to be sent)
  const { processed: processedCount, results } = await processPendingNotifications(supabase);

  // Return the combined results
  return { 
    processed: processedCount,
    created: createdCount,
    results 
  };
}
