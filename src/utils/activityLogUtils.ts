import { supabase } from "@/integrations/supabase/client";

export const getActorName = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "System";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      return profile.full_name;
    }
    return user.email || "Unknown user";
  } catch {
    return "System";
  }
};

export const addActivityLogEntry = async (
  eventCode: string,
  actor: string,
  action: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("event_activity_log")
      .insert({ event_code: eventCode, actor, action });
    if (error) throw error;
  } catch (error) {
    console.error("Failed to add activity log entry:", error);
  }
};
