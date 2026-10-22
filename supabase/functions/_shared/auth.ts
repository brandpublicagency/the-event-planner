import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.0";

/**
 * Returns the signed-in user's id, or null when the request has no valid session.
 */
export const getAuthenticatedUserId = async (req: Request): Promise<string | null> => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
};
