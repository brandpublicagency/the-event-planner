import { supabase } from "@/integrations/supabase/client";

export async function checkFileExists(filePath: string) {
  console.log('[Storage] Checking if file exists:', filePath);
  
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
    console.log('[Storage] File exists:', exists);
    return { exists, error: null };
  } catch (error) {
    console.error('[Storage] Error checking file:', error);
    return { exists: false, error };
  }
}

export async function deleteFile(filePath: string, fileId: string, taskId: string) {
  console.log('[Delete] Starting file deletion:', { filePath, fileId, taskId });

  try {
    // First delete from storage
    const { error: storageError } = await supabase.storage
      .from("task-files")
      .remove([filePath]);

    if (storageError) {
      console.error('[Delete] Storage deletion error:', storageError);
      throw storageError;
    }

    console.log('[Delete] Storage deletion successful');

    // Then delete from database
    const { error: dbError } = await supabase
      .from("task_files")
      .delete()
      .eq("id", fileId);

    if (dbError) {
      console.error('[Delete] Database deletion error:', dbError);
      throw dbError;
    }

    console.log('[Delete] Database deletion successful');
    return true;
  } catch (error) {
    console.error('[Delete] Error during deletion:', error);
    throw error;
  }
}