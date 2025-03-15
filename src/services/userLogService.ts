
import { supabase } from "@/integrations/supabase/client";

export type UserActivity = {
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  timestamp?: string;
};

export const logUserActivity = async (activity: Omit<UserActivity, "timestamp">) => {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user.id;
    
    // Only proceed if we have an authenticated user
    if (!currentUserId) {
      console.warn("Cannot log activity: No authenticated user");
      return;
    }
    
    // Log activity to console for development purposes
    console.log(`USER ACTIVITY: ${activity.user_name} ${activity.action} ${activity.entity_type} ${activity.entity_id}`);
    
    // Store activity in database
    const { error } = await supabase
      .from("user_activities")
      .insert({
        ...activity,
        user_id: currentUserId, // Use the current authenticated user's ID
        timestamp: new Date().toISOString()
      });
      
    if (error) {
      console.error("Error logging user activity:", error);
    }
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
};

export const getRecentActivities = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("user_activities")
      .select(`
        id,
        user_id,
        user_name,
        action,
        entity_type,
        entity_id,
        details,
        timestamp
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
};

export const getEntityHistory = async (entityType: string, entityId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from("user_activities")
      .select(`
        id,
        user_id,
        user_name,
        action,
        details,
        timestamp
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error(`Error fetching history for ${entityType} ${entityId}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Failed to fetch history for ${entityType} ${entityId}:`, error);
    return [];
  }
};
