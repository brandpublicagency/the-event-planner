import { supabase } from "@/integrations/supabase/client";
import type { ActivityLogEntry } from "@/types/event";

export const getActorName = async (): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "System";

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, surname")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      return profile.surname
        ? `${profile.full_name} ${profile.surname}`
        : profile.full_name;
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
    const { data: event } = await supabase
      .from("events")
      .select("activity_log")
      .eq("event_code", eventCode)
      .single();

    const currentLog: ActivityLogEntry[] = Array.isArray(event?.activity_log)
      ? (event.activity_log as unknown as ActivityLogEntry[])
      : [];

    const newEntry: ActivityLogEntry = {
      actor,
      action,
      timestamp: new Date().toISOString(),
    };

    const updatedLog = [newEntry, ...currentLog];

    await supabase
      .from("events")
      .update({ activity_log: updatedLog } as any)
      .eq("event_code", eventCode);
  } catch (error) {
    console.error("Failed to add activity log entry:", error);
  }
};
