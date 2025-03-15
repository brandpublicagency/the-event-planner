
import { Task } from "@/contexts/task/taskTypes";
import { logUserActivity } from "@/services/userLogService";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const useTaskActivityLogging = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  
  // Get current user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) return;
        
        const userId = sessionData.session.user.id;
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .single();
          
        if (profileData) {
          setCurrentUser({
            id: userId,
            name: profileData.full_name || profileData.email || 'Unknown user'
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const logTaskCreated = async (task: Task) => {
    if (!currentUser) return;
    
    await logUserActivity({
      user_id: currentUser.id,
      user_name: currentUser.name,
      action: "created",
      entity_type: "task",
      entity_id: task.id,
      details: { title: task.title }
    });
  };
  
  const logTaskUpdated = async (task: Task, updatedFields: string[]) => {
    if (!currentUser) return;
    
    await logUserActivity({
      user_id: currentUser.id,
      user_name: currentUser.name,
      action: "updated",
      entity_type: "task",
      entity_id: task.id,
      details: { 
        title: task.title,
        fields_updated: updatedFields
      }
    });
  };
  
  const logTaskDeleted = async (task: Task) => {
    if (!currentUser) return;
    
    await logUserActivity({
      user_id: currentUser.id,
      user_name: currentUser.name,
      action: "deleted",
      entity_type: "task",
      entity_id: task.id,
      details: { title: task.title }
    });
  };
  
  return {
    logTaskCreated,
    logTaskUpdated,
    logTaskDeleted,
    currentUser
  };
};
