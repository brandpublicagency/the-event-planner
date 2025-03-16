
/**
 * Remove duplicate notifications keeping only the most recent
 */
export async function cleanupDuplicateNotifications(supabase) {
  try {
    console.log('Starting duplicate notification cleanup...');
    
    const { data: allNotifications, error: fetchError } = await supabase
      .from('event_notifications')
      .select('id, event_code, notification_type, sent_at, is_read')
      .not('is_completed', 'eq', true)
      .filter('sent_at', 'not.is', null)
      .order('sent_at', { ascending: false });
      
    if (fetchError || !allNotifications) {
      console.error('Error fetching notifications for cleanup:', fetchError);
      return;
    }
    
    console.log(`Found ${allNotifications.length} notifications to check for duplicates`);
    
    const seen = new Map();
    const duplicates = [];
    
    allNotifications.forEach(notification => {
      const key = `${notification.event_code}_${notification.notification_type}`;
      
      if (seen.has(key)) {
        duplicates.push(notification.id);
      } else {
        seen.set(key, notification.id);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate notifications to clean up`);
      
      const { error: updateError } = await supabase
        .from('event_notifications')
        .update({ is_completed: true })
        .in('id', duplicates);
        
      if (updateError) {
        console.error('Error cleaning up duplicate notifications:', updateError);
      } else {
        console.log(`Successfully cleaned up ${duplicates.length} duplicate notifications`);
      }
    } else {
      console.log('No duplicate notifications found');
    }
  } catch (error) {
    console.error('Error during notification cleanup:', error);
  }
}
