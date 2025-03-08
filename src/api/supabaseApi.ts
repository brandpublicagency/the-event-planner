
import { supabase } from "@/integrations/supabase/client";

// API function to fetch link preview
export const fetchLinkPreview = async (url: string) => {
  const { data, error } = await supabase.functions.invoke('fetch-link-preview', {
    body: { url }
  });

  if (error) {
    console.error('Error fetching link preview:', error);
    throw error;
  }

  return data;
};
