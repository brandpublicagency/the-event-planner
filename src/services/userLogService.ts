
import { supabase } from "@/integrations/supabase/client";

export interface UserActivity {
  id?: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export const logUserActivity = async (activity: Omit<UserActivity, "timestamp" | "id">) => {
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
    
    // Store activity in database - using RPC for custom tables
    const { error } = await supabase.rpc('log_user_activity', {
      p_user_id: currentUserId,
      p_user_name: activity.user_name,
      p_action: activity.action,
      p_entity_type: activity.entity_type,
      p_entity_id: activity.entity_id,
      p_details: activity.details || {}
    });
      
    if (error) {
      console.error("Error logging user activity:", error);
    }
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
};

export const getRecentActivities = async (limit = 10): Promise<UserActivity[]> => {
  try {
    // Using RPC function to get the activities
    const { data, error } = await supabase.rpc('get_recent_activities', {
      p_limit: limit
    });
      
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

export const getEntityHistory = async (entityType: string, entityId: string, limit = 20): Promise<UserActivity[]> => {
  try {
    // Using RPC function to get entity history
    const { data, error } = await supabase.rpc('get_entity_history', {
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_limit: limit
    });
      
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
