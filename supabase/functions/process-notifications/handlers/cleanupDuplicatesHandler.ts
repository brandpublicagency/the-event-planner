
/**
 * Remove duplicate notifications keeping only the most recent
 */
export async function cleanupDuplicateNotifications(supabase) {
  try {
    console.log('Starting duplicate notification cleanup...');
    
    // Get all notifications that have been sent and are not already completed
    const { data: allNotifications, error: fetchError } = await supabase
      .from('event_notifications')
      .select('id, event_code, notification_type, sent_at, is_read, created_at')
      .not('is_completed', 'eq', true)
      .filter('sent_at', 'not.is', null)
      .order('created_at', { ascending: false });
      
    if (fetchError || !allNotifications) {
      console.error('Error fetching notifications for cleanup:', fetchError);
      return { cleaned: 0 };
    }
    
    console.log(`Found ${allNotifications.length} notifications to check for duplicates`);
    
    const seen = new Map();
    const duplicates = [];
    
    // Track the most recent notification for each event+type combination
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
      
      // Mark duplicates as completed
      const { error: updateError } = await supabase
        .from('event_notifications')
        .update({ 
          is_completed: true,
          updated_at: new Date().toISOString()
        })
        .in('id', duplicates);
        
      if (updateError) {
        console.error('Error cleaning up duplicate notifications:', updateError);
        return { cleaned: 0, error: updateError.message };
      } else {
        console.log(`Successfully cleaned up ${duplicates.length} duplicate notifications`);
        return { cleaned: duplicates.length };
      }
    } else {
      console.log('No duplicate notifications found');
      return { cleaned: 0 };
    }
  } catch (error) {
    console.error('Error during notification cleanup:', error);
    return { cleaned: 0, error: error.message };
  }
}
