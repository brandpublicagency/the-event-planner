import { supabase } from "@/integrations/supabase/client";

export async function checkFileExists(filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from("task-files")
      .list('', {
        search: filePath
      });

    if (error) {
      console.error('[Storage] Error checking file:', error);
      return { exists: false, error };
    }

    const exists = data && data.length > 0;
    return { exists, error: null };
  } catch (error) {
    console.error('[Storage] Error checking file:', error);
    return { exists: false, error };
  }
}

export async function deleteFile(filePath: string, fileId: string, taskId: string) {
  try {
    // First delete from storage
    const { error: storageError } = await supabase.storage
      .from("task-files")
      .remove([filePath]);

    if (storageError) {
      console.error('[Delete] Storage deletion error:', storageError);
      throw storageError;
    }
    // Then delete from database
    const { error: dbError } = await supabase
      .from("task_files")
      .delete()
      .eq("id", fileId);

    if (dbError) {
      console.error('[Delete] Database deletion error:', dbError);
      throw dbError;
    }
    return true;
  } catch (error) {
    console.error('[Delete] Error during deletion:', error);
    throw error;
  }
}