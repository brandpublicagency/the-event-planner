
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
      return null;
    }
    
    // Log activity to console for development purposes
    console.log(`USER ACTIVITY: ${activity.user_name} ${activity.action} ${activity.entity_type} ${activity.entity_id}`);
    
    // Store activity in database
    const { data, error } = await supabase.from('user_activities').insert({
      user_id: currentUserId,
      user_name: activity.user_name,
      action: activity.action,
      entity_type: activity.entity_type,
      entity_id: activity.entity_id,
      details: activity.details || {}
    }).select().single();
      
    if (error) {
      console.error("Error logging user activity:", error);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to log user activity:", error);
    return null;
  }
};

export const getRecentActivities = async (limit = 10): Promise<UserActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
    
    // Convert JSON details to Record<string, any>
    return (data || []).map(item => ({
      ...item,
      details: typeof item.details === 'string' 
        ? JSON.parse(item.details) 
        : (item.details || {})
    })) as UserActivity[];
  } catch (error) {
    console.error("Failed to fetch recent activities:", error);
    return [];
  }
};

export const getEntityHistory = async (entityType: string, entityId: string, limit = 20): Promise<UserActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error(`Error fetching history for ${entityType} ${entityId}:`, error);
      return [];
    }
    
    // Convert JSON details to Record<string, any>
    return (data || []).map(item => ({
      ...item,
      details: typeof item.details === 'string' 
        ? JSON.parse(item.details) 
        : (item.details || {})
    })) as UserActivity[];
  } catch (error) {
    console.error(`Failed to fetch history for ${entityType} ${entityId}:`, error);
    return [];
  }
};
