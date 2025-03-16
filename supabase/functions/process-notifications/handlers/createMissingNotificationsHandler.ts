
/**
 * Create missing notifications for recent events
 */
export async function createMissingNotifications(supabase, notificationTriggers) {
  try {
    console.log('Checking for missing notifications...');
    
    const daysToLookBack = 30;
    const lookBackDate = new Date();
    lookBackDate.setDate(lookBackDate.getDate() - daysToLookBack);

    // Fetch recent events
    const { data: recentEvents, error: recentEventsError } = await supabase
      .from('events')
      .select('event_code, name, event_type, primary_name, event_date, created_at')
      .gte('created_at', lookBackDate.toISOString())
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (recentEventsError) {
      console.error('Error fetching recent events:', recentEventsError);
      throw recentEventsError;
    }
    
    console.log(`Checking ${recentEvents?.length || 0} events for missing notifications...`);
    
    let createdCount = 0;
    
    // Find relevant notification triggers
    const unifiedTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'event_created_unified'
    );
    
    const paymentReminderTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'final_payment_reminder'
    );
    
    const documentDueReminderTrigger = notificationTriggers.find(trigger => 
      trigger.template_type === 'document_due_reminder'
    );
    
    console.log('Found unified trigger:', unifiedTrigger ? 'yes' : 'no');
    console.log('Found payment reminder trigger:', paymentReminderTrigger ? 'yes' : 'no');
    console.log('Found document due reminder trigger:', documentDueReminderTrigger ? 'yes' : 'no');
    
    // Define required notification types
    const requiredTypes = [
      'event_created_unified',   // Unified type
      'event_incomplete',        // Keep this one
      'final_payment_reminder',  // Final payment reminder type
      'document_due_reminder'    // Document due reminder type
    ];
    
    // Process document due reminders first
    await processDocumentDueReminders(supabase, recentEvents, documentDueReminderTrigger);
    
    // Then process all other notification types
    for (const event of recentEvents || []) {
      console.log(`Checking notifications for event ${event.event_code} (${event.name})`);
      
      const { data: existingNotifications, error: notificationError } = await supabase
        .from('event_notifications')
        .select('notification_type, sent_at')
        .eq('event_code', event.event_code);
        
      if (notificationError) {
        console.error(`Error checking notifications for event ${event.event_code}:`, notificationError);
        continue;
      }
      
      const existingTypes = new Set(existingNotifications?.map(n => n.notification_type) || []);
      console.log(`Event ${event.event_code} has notifications: ${Array.from(existingTypes).join(', ')}`);
      
      // Create unified notification if needed
      if (!existingTypes.has('event_created_unified')) {
        if (existingTypes.has('event_created') || 
            existingTypes.has('document_send_reminder') || 
            existingTypes.has('invoice_reminder')) {
          
          console.log(`Creating unified notification for event ${event.event_code} to replace old types`);
          
          const { error: insertError } = await supabase
            .from('event_notifications')
            .insert({
              event_code: event.event_code,
              notification_type: 'event_created_unified',
              scheduled_for: new Date().toISOString(),
              sent_at: new Date().toISOString(), // Mark as sent immediately
            });
            
          if (insertError) {
            console.error(`Error creating unified notification for event ${event.event_code}:`, insertError);
          } else {
            createdCount++;
            console.log(`Created unified notification for event ${event.event_code}`);
            
            // Mark old notification types as completed
            if (existingTypes.has('event_created') || 
                existingTypes.has('document_send_reminder') || 
                existingTypes.has('invoice_reminder')) {
              
              const { error: updateError } = await supabase
                .from('event_notifications')
                .update({ is_completed: true })
                .eq('event_code', event.event_code)
                .in('notification_type', ['event_created', 'document_send_reminder', 'invoice_reminder']);
                
              if (updateError) {
                console.error(`Error marking old notifications as completed for event ${event.event_code}:`, updateError);
              } else {
                console.log(`Successfully marked old notifications as completed for event ${event.event_code}`);
              }
            }
          }
        }
      }
      
      // Check for all required notification types
      for (const notificationType of requiredTypes) {
        // Skip if already addressed
        if (notificationType === 'event_created_unified' && 
            (existingTypes.has('event_created_unified') || createdCount > 0)) {
          continue;
        }
        
        if (notificationType === 'document_due_reminder' && 
            existingTypes.has('document_due_reminder')) {
          continue;
        }
        
        // Skip proforma reminders entirely
        if (notificationType === 'proforma_reminder') {
          continue;
        }
        
        // Create missing notification if needed
        if (!existingTypes.has(notificationType)) {
          await createSingleNotification(
            supabase, 
            event, 
            notificationType, 
            existingTypes
          );
          createdCount++;
        } else {
          // Check for unsent notifications that should be sent
          const unsent = existingNotifications.find(n => 
            n.notification_type === notificationType && n.sent_at === null
          );
          
          if (unsent) {
            console.log(`Found unsent ${notificationType} notification for event ${event.event_code}, marking as sent`);
            
            const { error: updateError } = await supabase
              .from('event_notifications')
              .update({ 
                sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('event_code', event.event_code)
              .eq('notification_type', notificationType)
              .is('sent_at', null);
              
            if (updateError) {
              console.error(`Error marking ${notificationType} notification as sent:`, updateError);
            } else {
              console.log(`Successfully marked ${notificationType} notification as sent for event ${event.event_code}`);
            }
          }
        }
      }
    }
    
    console.log(`Created ${createdCount} missing notifications`);
    return createdCount;
  } catch (error) {
    console.error('Error creating missing notifications:', error);
    return 0;
  }
}

/**
 * Process document due reminders specifically
 */
async function processDocumentDueReminders(supabase, events, trigger) {
  for (const event of events || []) {
    if (!event.event_date) continue;
    
    console.log(`Checking document_due_reminder for event ${event.event_code} (date: ${event.event_date})`);
    
    const { data: existingReminders, error: remindersError } = await supabase
      .from('event_notifications')
      .select('*')
      .eq('event_code', event.event_code)
      .eq('notification_type', 'document_due_reminder')
      .not('is_completed', 'eq', true);
      
    if (remindersError) {
      console.error(`Error checking reminders for event ${event.event_code}:`, remindersError);
      continue;
    }
    
    if (existingReminders && existingReminders.length > 0) {
      console.log(`Found ${existingReminders.length} document due reminders for event ${event.event_code}`);
      
      const eventDate = new Date(event.event_date);
      const correctReminderDate = new Date(eventDate);
      correctReminderDate.setDate(eventDate.getDate() - 14);
      
      for (const reminder of existingReminders) {
        const reminderDate = new Date(reminder.scheduled_for);
        const daysBeforeEvent = Math.round((eventDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysBeforeEvent > 16 || daysBeforeEvent < 12) {
          console.log(`Marking outdated document reminder ${reminder.id} as completed (scheduled ${daysBeforeEvent} days before event)`);
          
          const { error: updateError } = await supabase
            .from('event_notifications')
            .update({ 
              is_completed: true,
              updated_at: new Date().toISOString() 
            })
            .eq('id', reminder.id);
            
          if (updateError) {
            console.error(`Error marking reminder ${reminder.id} as completed:`, updateError);
          }
        }
      }
      
      if (existingReminders.every(r => r.is_completed)) {
        console.log(`Creating new correctly timed document reminder for event ${event.event_code}`);
        
        const { error: insertError } = await supabase
          .from('event_notifications')
          .insert({
            event_code: event.event_code,
            notification_type: 'document_due_reminder',
            scheduled_for: correctReminderDate.toISOString(),
            sent_at: correctReminderDate <= new Date() ? new Date().toISOString() : null,
          });
          
        if (insertError) {
          console.error(`Error creating document due reminder for event ${event.event_code}:`, insertError);
        } else {
          console.log(`Created document due reminder for event ${event.event_code}, scheduled for ${correctReminderDate.toISOString()}`);
        }
      }
    }
  }
}

/**
 * Create a single notification for an event
 */
async function createSingleNotification(supabase, event, notificationType, existingTypes) {
  console.log(`Creating missing ${notificationType} notification for event ${event.event_code}`);
  
  let scheduledFor = new Date().toISOString();
  let shouldMarkAsSent = false;
  
  if (notificationType === 'event_created_unified') {
    scheduledFor = new Date().toISOString();
    shouldMarkAsSent = true;
  } else if (notificationType === 'event_incomplete' && event.event_date) {
    const eventDate = new Date(event.event_date);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(eventDate.getDate() - 7);
    scheduledFor = reminderDate.toISOString();
  } else if (notificationType === 'final_payment_reminder' && event.event_date) {
    const eventDate = new Date(event.event_date);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(eventDate.getDate() - 7);
    scheduledFor = reminderDate.toISOString();
  } else if (notificationType === 'document_due_reminder' && event.event_date) {
    const eventDate = new Date(event.event_date);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(eventDate.getDate() - 14);
    scheduledFor = reminderDate.toISOString();
  }
  
  if (
    (notificationType === 'document_due_reminder' || 
     notificationType === 'event_incomplete' ||
     notificationType === 'final_payment_reminder') && 
    !event.event_date
  ) {
    console.log(`Skipping ${notificationType} for event ${event.event_code} - no event date set`);
    return;
  }
  
  if (new Date(scheduledFor) <= new Date()) {
    shouldMarkAsSent = true;
  }
  
  const { error: insertError } = await supabase
    .from('event_notifications')
    .insert({
      event_code: event.event_code,
      notification_type: notificationType,
      scheduled_for: scheduledFor,
      sent_at: shouldMarkAsSent ? new Date().toISOString() : null,
    });
    
  if (insertError) {
    console.error(`Error creating ${notificationType} notification for event ${event.event_code}:`, insertError);
  } else {
    console.log(`Created ${notificationType} notification for event ${event.event_code}, sent status: ${shouldMarkAsSent}`);
  }
}
