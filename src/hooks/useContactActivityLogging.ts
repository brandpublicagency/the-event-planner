
import { logUserActivity } from "@/services/userLogService";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";

export const useContactActivityLogging = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string } | null>(null);
  
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
  
  const logContactUpdated = async (contact: Contact, updatedFields: string[]): Promise<void> => {
    if (!currentUser) return;
    
    await logUserActivity({
      user_id: currentUser.id,
      user_name: currentUser.name,
      action: "updated",
      entity_type: "contact",
      entity_id: contact.id,
      details: { 
        name: contact.name,
        fields_updated: updatedFields
      }
    });
  };
  
  return {
    logContactUpdated,
    currentUser
  };
};
